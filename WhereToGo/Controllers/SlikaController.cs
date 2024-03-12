namespace WebTemplate.Controllers;

[ApiController]
[Route("[controller]")]
public class SlikaController : ControllerBase
{
    public ProjekatContext Context { get; set; }
    public IConfiguration Config { get; set; }
    public static IWebHostEnvironment? _webHostEnvironment;

    public SlikaController(ProjekatContext context, IConfiguration config, IWebHostEnvironment webHostEnvironment)
    {
        Context = context;
        Config=config;
        _webHostEnvironment = webHostEnvironment;
    }

    [HttpGet]
    [Route("VratiSlike")]
    public async Task<ActionResult<IEnumerable<Slike>>> VratiSlike()
    {
        return await Context.Slike.ToListAsync();
    }

    [HttpPost]
    [Route("DodajSliku")]
    public async Task<ActionResult<Slike>> DodajSliku([FromBody] Slike pictData)
    {
          
            

        var obj= await Context.UgostiteljskiObjekti.FindAsync(pictData.UgostiteljskiObjekat!.ID_Korisnik);
        Slike picData2 = new Slike
        {
            UgostiteljskiObjekat = obj,
            Pictures = pictData.Pictures
        };
            try
            {
                Context.Slike.Add(picData2);
                await Context.SaveChangesAsync();
            }

            catch (Exception)
            {
                return BadRequest("Doslo je do greske!");
            }
           

        return CreatedAtAction("GetPicturesData", new { id = picData2.ID }, picData2);
          
    }

     [HttpGet]
    [Route("VratiSliku/{idPict}")]
    public async Task<ActionResult<Slike>> VratiSliku(int idPict)
    {

        if(idPict < 0)
        {
            return BadRequest("Pogresan id!");
        }
        var picData = await Context.Slike.FindAsync(idPict);

        if (picData == null)
        {
            return NotFound("Nije pronadjena slika!");
        }

        return picData!;
    }

    [HttpDelete]
    [Route("ObrisiSliku/{idPicture}")]
    public async Task<ActionResult> ObrisiSliku(int idPicture)
    {
            
        if(idPicture<=0)
        {
            return BadRequest("Pogresan ID");
        }
        try
        {           
            var pictureData = await Context.Slike.FindAsync(idPicture);
            if(pictureData==null){return BadRequest("Ne postoji ovakva slika!");}
            Context.Slike.Remove(pictureData!);
            await Context.SaveChangesAsync();  
            }
            catch (Exception e)
            {
                    
                return BadRequest(e.Message);
            }
        return Ok($"Uspesno izbrisana slika");
            
    }

}