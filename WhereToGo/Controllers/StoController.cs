namespace WebTemplate.Controllers;

[ApiController]
[Route("[controller]")]
public class StoController : ControllerBase
{
    public ProjekatContext Context { get; set; }
    public IConfiguration Config { get; set; }
    public System.Timers.Timer _timer;

    public StoController(ProjekatContext context, IConfiguration config)
    {
        Context = context;
        Config=config;
        _timer = new System.Timers.Timer(1 * 60 * 1000);
    }

    [HttpGet]
    [Route("VratiStolove/{id}")]
    public async Task<ActionResult> VratiStolove(int id)
    {
        var objekat=await Context.UgostiteljskiObjekti.Include(o => o.Stolovi)
                                                      .FirstOrDefaultAsync(p => p.ID_Korisnik == id);
        if(objekat==null){return BadRequest("Ne postoji ovaj ugostiteljski objekat!");}

        var stolovi = Context.Stolovi.Where(sto => sto.Status == StatusStola.Rezervisan && sto.PoslednjaRezervacija.AddMinutes(1) <= DateTime.Now).ToList();
        foreach (var sto in stolovi)
        {
            sto.Status = StatusStola.Slobodan;
            Context.Stolovi.Update(sto);
            await Context.SaveChangesAsync();
        }

        return Ok(objekat.Stolovi);

    }

    [HttpGet]
    [Route("VratiRezervisaneStolove/{id}")]
    public async Task<ActionResult> VratiRezervisaneStolove(int id)
    {
        var objekat=await Context.UgostiteljskiObjekti.Include(o => o.Stolovi)
                                                      .FirstOrDefaultAsync(p => p.ID_Korisnik == id);
        if(objekat==null){return BadRequest("Ne postoji ovaj ugostiteljski objekat!");}
        //var stolovi=objekat!.Stolovi;
        List<Sto> listaStolova = new List<Sto>();

         foreach(var p in objekat.Stolovi!.ToList())
        {
            if(p.Status==StatusStola.Rezervisan)
            {
                listaStolova.Add(p);
            }
            
        }

        return Ok(listaStolova);

    }

    [HttpGet]
    [Route("VratiSlobodneStolove/{id}")]
    public async Task<ActionResult> VratiSlobodneStolove(int id)
    {
        var objekat=await Context.UgostiteljskiObjekti.Include(o => o.Stolovi)
                                                      .FirstOrDefaultAsync(p => p.ID_Korisnik == id);
        if(objekat==null){return BadRequest("Ne postoji ovaj ugostiteljski objekat!");}
        //var stolovi=objekat!.Stolovi;
        List<Sto> listaStolova = new List<Sto>();

         foreach(var p in objekat.Stolovi!.ToList())
        {
            if(p.Status==StatusStola.Slobodan)
            {
                listaStolova.Add(p);
            }
            
        }

        return Ok(listaStolova);

    }

    [HttpPost]
    [Route("RezervisiSto/{idStola}/{idObjekta}")]
    public async Task<ActionResult> RezervisiSto(int idStola, int idObjekta)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==idObjekta).FirstOrDefaultAsync();
        if(objekat==null){return BadRequest("Ovaj objekat ne postoji!");}

        var sto = await Context.Stolovi.Where(p=>p.ID==idStola && p.UgostiteljskiObjekat==objekat).FirstOrDefaultAsync();
        if(sto==null){return BadRequest("Ovaj sto ne postoji ili je zauzet");}

        if(sto.Status==StatusStola.Rezervisan){return BadRequest("Ovaj sto je vec rezervisan");}
        else {
            sto.Status=StatusStola.Rezervisan;
            sto.PoslednjaRezervacija = DateTime.Now;

            Context.UgostiteljskiObjekti.Update(objekat);
            Context.Stolovi.Update(sto);
            await Context.SaveChangesAsync();
            
            _timer.Start();

        }

        
        return Ok(sto);
    }

    [HttpGet]
    [Route("OtkaziRezervaciju/{idStola}/{idObjekta}")]
    public async Task<ActionResult> OtkaziRezervaciju(int idStola, int idObjekta)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==idObjekta).FirstOrDefaultAsync();
        if(objekat==null){return BadRequest("Ovaj objekat ne postoji!");}

        var sto = await Context.Stolovi.Where(p=>p.ID==idStola || p.UgostiteljskiObjekat==objekat).FirstOrDefaultAsync();
        if(sto==null){return BadRequest("Ovaj sto ne postoji ili ne postoji u ovom Ugostiteljskom objektu!");}

        if(sto.Status==StatusStola.Slobodan){return BadRequest("Ovaj sto nije rezervisan");}
        else {sto.Status=StatusStola.Slobodan;}

        Context.UgostiteljskiObjekti.Update(objekat);
        Context.Stolovi.Update(sto);
        await Context.SaveChangesAsync();
        
        return Ok(sto);
    }

    [HttpPost]
    [Route("DodajBarski/{kapacitet}/{id}")]
    public async Task<ActionResult> DodajBarski(int kapacitet, int id)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();
        if(objekat==null){return BadRequest("Ovaj ugostiteljski objekat ne postoji!");}
        Sto sto=new Sto
        {
            UgostiteljskiObjekat=objekat,
            Tip=VrstaStola.Barski,
            Kapacitet=kapacitet,
            Status=StatusStola.Slobodan

        };

        try
        {
            Context.Stolovi.Add(sto);
            objekat.Stolovi!.Add(sto);
            Context.UgostiteljskiObjekti.Update(objekat);
            await Context.SaveChangesAsync();

            return Ok(sto);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost]
    [Route("DodajSepare/{kapacitet}/{id}")]
    public async Task<ActionResult> DodajSepare(int kapacitet, int id)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();
        if(objekat==null){return BadRequest("Ovaj ugostiteljski objekat ne postoji!");}
        Sto sto=new Sto
        {
            UgostiteljskiObjekat=objekat,
            Tip=VrstaStola.Separe,
            Kapacitet=kapacitet,
            Status=StatusStola.Slobodan,

        };

        try
        {
            Context.Stolovi.Add(sto);
            objekat.Stolovi!.Add(sto);
            Context.UgostiteljskiObjekti.Update(objekat);
            await Context.SaveChangesAsync();

            return Ok(sto);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost]
    [Route("DodajNiskiSto/{kapacitet}/{id}")]
    public async Task<ActionResult> DodajNiskiSto(int kapacitet, int id)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();
        if(objekat==null){return BadRequest("Ovaj ugostiteljski objekat ne postoji!");}
        Sto sto=new Sto
        {
            UgostiteljskiObjekat=objekat,
            Tip=VrstaStola.Niski_sto,
            Kapacitet=kapacitet,
            Status=StatusStola.Slobodan,

        };

        try
        {
            Context.Stolovi.Add(sto);
            objekat.Stolovi!.Add(sto);
            Context.UgostiteljskiObjekti.Update(objekat);
            await Context.SaveChangesAsync();

            return Ok(sto);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost]
    [Route("DodajSank/{kapacitet}/{id}")]
    public async Task<ActionResult> DodajSank(int kapacitet, int id)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();
        if(objekat==null){return BadRequest("Ovaj ugostiteljski objekat ne postoji!");}
        Sto sto=new Sto
        {
            UgostiteljskiObjekat=objekat,
            Tip=VrstaStola.Sank,
            Kapacitet=kapacitet,
            Status=StatusStola.Slobodan,

        };

        try
        {
            Context.Stolovi.Add(sto);
            objekat.Stolovi!.Add(sto);
            Context.UgostiteljskiObjekti.Update(objekat);
            await Context.SaveChangesAsync();

            return Ok(sto);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete]
    [Route("ObrisiSto/{idUgostiteljskogObjekta}/{idStola}")]
    public async Task<ActionResult> ObrisiSto(int idUgostiteljskogObjekta,int idStola)

    {
        var objekat=await Context.UgostiteljskiObjekti.Include(p=>p.Stolovi).Where(p=>p.ID_Korisnik==idUgostiteljskogObjekta).FirstOrDefaultAsync();
        if(objekat==null){return BadRequest("Ovaj objekat ne postoji");}
        var sto= objekat.Stolovi!.Where(p=>p.ID==idStola).FirstOrDefault();
        if(sto==null){return BadRequest("Ovaj sto ne postoji!");}


        Context.Stolovi.Remove(sto);
        Context.UgostiteljskiObjekti.Update(objekat);
        await Context.SaveChangesAsync();

        return Ok("Uspesno obrisan sto!");
    }



}