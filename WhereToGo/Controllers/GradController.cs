namespace WebTemplate.Controllers;

[ApiController]
[Route("[controller]")]
public class GradController : ControllerBase
{
    public ProjekatContext Context { get; set; }
    public IConfiguration Config { get; set; }

    public GradController(ProjekatContext context, IConfiguration config)
    {
        Context = context;
        Config=config;
    }

    [HttpGet]
    [Route("VratiGradove")]
    public async Task<ActionResult> VratiGradove()
    {
        var gradovi=await Context.Gradovi.ToListAsync();

        return Ok(gradovi);
    }

    [HttpGet]
    [Route("VratiUgostiteljeskiObjekte/{grad}")]
    public async Task<ActionResult> VratiUgostiteljskeObjekte(string grad)
    {
        var Grad=await Context.Gradovi.Include(p=>p.UgostiteljskiObjekti).Where(p=>p.Naziv==grad).FirstOrDefaultAsync();

        if(Grad==null){return BadRequest("Ovaj grad ne postoji!");}

        var objekti=Grad!.UgostiteljskiObjekti;

        if(objekti==null){return BadRequest("Ovaj grad nema ugostitljske objekte u ovoj aplikaciji!");}

        return Ok(objekti);
    }

    [HttpPost]
    [Route("DodajGrad/{naziv}")]
    public async Task<IActionResult> DodajGrad(string naziv)
    {
        if(string.IsNullOrEmpty(naziv)){return BadRequest("Morate uneti naziv");}

        Grad grad=new Grad
        {
            Naziv=naziv,
            UgostiteljskiObjekti=new List<UgostiteljskiObjekat>()
        };

        Context.Gradovi.Add(grad);
        await Context.SaveChangesAsync();

        return Ok("Uspesno dodat grad!");
    }

}