namespace WebTemplate.Controllers;

[ApiController]
[Route("[controller]")]
public class UgostiteljskiObjekatController : ControllerBase
{
    public ProjekatContext Context { get; set; }
    public IConfiguration Config { get; set; }

    public UgostiteljskiObjekatController(ProjekatContext context, IConfiguration config)
    {
        Context = context;
        Config=config;
    }

    #region GET

    [HttpGet]
    [Route("VratiObjekte")]
    public async Task<ActionResult> VratiObjekte()
    {
        var objekti=await Context.UgostiteljskiObjekti.ToListAsync();

        return Ok(objekti);
    }

    [HttpGet]
    [Authorize]
    public IActionResult PosetilacEndPoint()
    {
        var trenutni=GetTrenutniObjekat();
        return Ok(trenutni);
    }

        private UgostiteljskiObjekat GetTrenutniObjekat()
    {
        var identity = HttpContext.User.Identity as ClaimsIdentity;

        if (identity != null)
        {
            var userClaims = identity.Claims;
            int ID = int.Parse(userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Sid)!.Value);

            return new UgostiteljskiObjekat
            {
                UserName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)!.Value,
                Email = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)!.Value,
                Uloga = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)!.Value,
                ID_Korisnik = ID,
                Naziv = userClaims.FirstOrDefault(o => o.Type == "Ime")!.Value,
                Password = Convert.FromBase64String(userClaims.FirstOrDefault(o => o.Type == "Password")!.Value),
                Salt = Convert.FromBase64String(userClaims.FirstOrDefault(o => o.Type == "Salt")!.Value),
            };
        }

        throw new InvalidOperationException("Identity not found or does not contain necessary claims.");
    }

    [HttpGet]
    [Route("VratiUgostiteljskiObjekat/{id}")]
    public async Task<ActionResult> VratiUgostitljeskiObjekat(int id)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();

        return Ok(objekat);
    }

    /*[HttpGet]
    [Route("LoginUgostiteljskiObjekat/{username}/{password}")]
    public async Task<ActionResult> LoginUgostiteljskiObjekat(string username, string password)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.UserName==username).FirstOrDefaultAsync();
        if(objekat==null) {return BadRequest("Pogresan username!");}
        
        if(VerifyPasswordHash(password, objekat.Password, objekat.Salt ))
        {
            return Ok(objekat);
        }
        else
        {
            return BadRequest("Pogresna lozinka!");
        }
        
    }*/

    [HttpGet]
    [Route("VratiUgostiteljskiObjekatFULL/{id}")]
    public async Task<ActionResult> VratiUgostiteljskiObjekatFULL(int id)
    {
        var objekat=await Context.UgostiteljskiObjekti
                          .Include(p=>p!.Stolovi)
                          .Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();

        if(objekat!=null){return Ok(objekat);}
        else {return BadRequest("UgostiteljskiObjekat sa id-jem ne postoji!");}                  
    }

    [HttpGet]
    [Route("PretraziObjekte/{parametar}")]
    public async Task<ActionResult> PretraziObjekte(string parametar)
    {
        var objekti=await Context.UgostiteljskiObjekti.Where(p=>p.Naziv.Contains(parametar)).ToListAsync();

        return Ok(objekti);
    }

    [HttpGet]
    [Route("Filter/{pet}/{pusenje}/{grad}")]
    public async Task<ActionResult> VratiPetFriendly(bool pet, bool pusenje, string grad)
    {
        var objekati=await Context.UgostiteljskiObjekti.Include(p=>p.Grad).Where(p=>(!pet || p.PetFriendly==pet) && (!pusenje || p.DozvoljenoPusenje==pusenje) && p.Grad!.Naziv==grad).ToListAsync();
        if(objekati==null){return BadRequest("Nema ovakvih objekata");}

        return Ok(objekati);
    }
    
[HttpGet]
    [Route("PotvrdiRezervaciju/{idStola}/{idObjekta}")]
    public async Task<ActionResult> PotvrdiRezervaciju(int idStola, int idObjekta)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==idObjekta).FirstOrDefaultAsync();

        if(objekat==null) {return BadRequest("Ovaj objekat ne postoji.");}

        var sto=await Context.Stolovi.Where(p=>p.ID==idStola).FirstOrDefaultAsync();

        if(sto==null){return BadRequest("Ovaj sto ne postoji");}
        if(objekat.Stolovi!.Contains(sto))
        {
            if(sto.Status!=StatusStola.Zauzet)
            {
                sto.Status=StatusStola.Zauzet;
                 Context.Stolovi.Update(sto);
                await Context.SaveChangesAsync();
                return Ok(sto);
               
            }
            else
            {
                return BadRequest("Ovaj sto je vec rezervisan!");
            }
        }
        else
        {
            return BadRequest("Ovaj sto ne pripada ovom ugostiteljskom objektu.");
        }
        

    }

    [HttpGet]
    [Route("OdbijRezervaciju/{idStola}/{idObjekta}")]
    public async Task<ActionResult> OdbijRezervaciju(int idStola, int idObjekta)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==idObjekta).FirstOrDefaultAsync();
        if(objekat==null){return BadRequest("Ne postoji ovaj ugostiteljski objekat");}

        var sto=await Context.Stolovi.Where(p=>p.ID==idStola).FirstOrDefaultAsync();
        if(sto==null){return BadRequest("Ovaj sto ne postoji!");}

        if(objekat.Stolovi!.Contains(sto))
        {
            if(sto.Status==StatusStola.Rezervisan)
            {
                sto.Status=StatusStola.Slobodan;
                return Ok("Vasa rezervacija je odbijena.");
            }
            return Ok("Rezervacija ne moze da se odbije.");
        }
        return BadRequest("Ovaj sto ne pripada ovom ugostitljskom objektu.");
    }

    [HttpGet]
    [Route("OslobodiSto/{idStola}/{idObjekta}")]
    public async Task<ActionResult> OslobodiSto(int idStola, int idObjekta)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==idObjekta).FirstOrDefaultAsync();

        if(objekat==null) {return BadRequest("Ovaj objekat ne postoji.");}

        var sto=await Context.Stolovi.Where(p=>p.ID==idStola).FirstOrDefaultAsync();

        if(sto==null){return BadRequest("Ovaj sto ne postoji");}
        if(objekat.Stolovi!.Contains(sto))
        {
            if(sto.Status==StatusStola.Zauzet)
            {
                sto.Status=StatusStola.Slobodan;
                Context.Stolovi.Update(sto);
                await Context.SaveChangesAsync();
                return Ok(sto);
                 
            }
            else
            {
                return BadRequest("Ovaj sto je  slobodan");
            }
        }
        else
        {
            return BadRequest("Ovaj sto ne pripada ovom ugostiteljskom objektu.");
        }
    }
    
    [AllowAnonymous]
    [HttpGet]
    [Route("LogInUgostiteljskiObjekat/{username}/{password}")]
    public async Task<ActionResult> LogInUgostiteljskiObjekat(string username, string password)
    {
        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.UserName==username).FirstOrDefaultAsync();
        if(objekat==null) return Ok(null);
        if(VerifyPasswordHash(password, objekat.Password, objekat.Salt))
        {
            return Ok(objekat);
        }
        else
        {
            return Ok(null);
        }
    }

    [AllowAnonymous]
    [HttpPost]
    [Route("GetToken")]
    public async Task<ActionResult> GetToken([FromBody] KorisnikAuth user)
    {
        var korisnik=await Context.UgostiteljskiObjekti.Where(k=>k.UserName==user.username).FirstOrDefaultAsync();
        if(korisnik==null) return Ok(null);
        if(VerifyPasswordHash(user.password, korisnik.Password, korisnik.Salt))
        {
            var token=Generate(korisnik);
            return Ok(new {token=token});
        }
        else
        {
            return Ok(null);
        }
    }

    private string Generate(UgostiteljskiObjekat korisnik)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config["Jwt:Key"]?? string.Empty));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, korisnik.UserName),
            new Claim(ClaimTypes.Email, korisnik.Email),
            new Claim(ClaimTypes.Role, korisnik.Uloga),
            new Claim(ClaimTypes.Sid, korisnik.ID_Korisnik.ToString())
        };

        var token = new JwtSecurityToken(Config["Jwt:Issuer"],
            Config["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);

    }

    [Route("VerifikacijaUgostiteljskihObjekata/{id}/{konf}")]
    [HttpGet]
    public async Task<ActionResult> VerifikacijaUgostiteljskihObjekata(int id, int konf)
    {
        var korisnik = Context.UgostiteljskiObjekti.Where(k => k.ID_Korisnik == id).FirstOrDefault();

        if (korisnik!.Konf_broj != konf)
            return Ok("Bad Conformation number");

        korisnik.Nalog_verifikovan = true;

        Context.UgostiteljskiObjekti.Update(korisnik);

        await Context.SaveChangesAsync();
        
        
        return Ok("Your account has been successfully verified, you can now log in into your account.");
        
    }

    
    [AllowAnonymous]
    [HttpGet]
    [Route("NalogVerifikovan/{id}")]
    public bool nalogVerifikovan(int id)
    {
        var ugostiteljskiObj=Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefault();
        if(ugostiteljskiObj==null){return false;}

        return (ugostiteljskiObj.Nalog_verifikovan);
    }

    [HttpGet]
    [Route("VratiProsecnuOcenu/{idObjekat}/{idPosetilac}/{ocena}")]
    public async Task<ActionResult> VratiProsecnuOcenu(int idObjekat, int idPosetilac, double ocena)
    {
        var objekat=await Context.UgostiteljskiObjekti.Include(p=>p.Ocene).Where(p=>p.ID_Korisnik==idObjekat).FirstOrDefaultAsync();
        if(objekat==null){return BadRequest("Ovaj objekat ne postoji!");}

        var posetilac=await Context.Posetioci.Include(p=>p.Ocene).Where(p=>p.ID==idPosetilac).FirstOrDefaultAsync();
        if(posetilac==null){return BadRequest("Ovaj objekat ne postoji!");}

         var NovaOcena=new Ocena{
            UgostiteljskiObjekat=objekat,
            Posetilac=posetilac,
            Vrednost=ocena
        };
                
        foreach(Ocena o in Context.Ocena.ToList())
        {
            if(o.UgostiteljskiObjekat==objekat && o.Posetilac==posetilac)
            {
                return Ok(null);
            }
        }
        


        if(objekat.Ocene!.Count()>0)
        {
            var zbir = 0.0;
            foreach(Ocena o in objekat.Ocene!.ToList())
            {
                zbir= zbir + o.Vrednost;
            }
            objekat.ProsecnaOcena=(zbir+ocena)/(objekat.Ocene!.Count()+1);
        }
        else
        {
            objekat.ProsecnaOcena=(objekat.ProsecnaOcena+ocena)/1;
        }

        objekat.Ocene!.Add(NovaOcena);
        posetilac.Ocene!.Add(NovaOcena);
        Context.Ocena.Add(NovaOcena);
        Context.Posetioci.Update(posetilac);
        Context.UgostiteljskiObjekti.Update(objekat);
        await Context.SaveChangesAsync();

       

        return Ok(objekat.ProsecnaOcena);
    }
    [HttpGet]
    [Route("VratiTrenutnuProsecnuOcenu/{id}/{idPosetilac}")]
    public async Task<ActionResult> VratitrenutnuProsecnuOcenu(int id, int idPosetilac)
    {
        var ugostiteljskiObj=await Context.UgostiteljskiObjekti.Include(p=>p.Ocene).Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync(); 

        if(idPosetilac != 0) {
            var posetilacObj = await Context.Posetioci.Include(p=>p.Ocene).Where(p=>p.ID==idPosetilac).FirstOrDefaultAsync(); 

            var response=await Context.Ocena.Where(p=>p.UgostiteljskiObjekat!.ID_Korisnik==ugostiteljskiObj!.ID_Korisnik&&p.Posetilac!.ID==posetilacObj!.ID).FirstOrDefaultAsync();
            if(response==null){return Ok(new{ prosecnaOcena=ugostiteljskiObj!.ProsecnaOcena });}
            var ocena=response!.Vrednost;

            return Ok(new{
                prosecnaOcena=ugostiteljskiObj!.ProsecnaOcena,
                ocenaPosetioca=ocena
            });
        }
        else {
            return Ok(new{
                prosecnaOcena=ugostiteljskiObj!.ProsecnaOcena,
            });
        }
    }


     [HttpGet]
    [Route("VratiOceneDuzinu")]
    public async Task<ActionResult> VratiOceneDuzinu()
    {
        var ocene=await Context.Ocena.ToListAsync();
       
        return Ok(ocene.Count());
    }

  [HttpGet]
[Route("VratiOcene")]
public async Task<ActionResult> VratiOcene()
{
    var ocene = await Context.Ocena
        .Include(o => o.UgostiteljskiObjekat)
        .Include(o => o.Posetilac)
        .Select(o => new 
        {
            UgostiteljskiObjekatId = o.UgostiteljskiObjekat!.ID_Korisnik,
            PosetilacId = o.Posetilac!.ID,
            Ocena = o.Vrednost,
            ID=o.ID
        })
        .ToListAsync();

    if (ocene == null || !ocene.Any())
    {
        return BadRequest("Nema ocena!");
    }

    return Ok(ocene);
}
    
    
    #endregion GET

    #region POST

    [HttpPost]
    [Route("UnosObjekta/{username}/{password}/{conformationPassword}/{naziv}/{email}/{grad}/{adresa}/{x}/{y}/{opis}/{vrsta}/{pet}/{pusenje}")]
    public async Task<ActionResult> UnosObjekta(string username, string password, string conformationPassword, string naziv, string email, 
    string grad, string adresa, float x, float y, string opis, string vrsta, bool pet, bool pusenje)
    {
        if(string.IsNullOrEmpty(username)) return Ok("Please enter your username!");
        if(username.Length>20) return Ok("Lenght of your username must not exceed 20 characters!");

        if (string.IsNullOrEmpty(password)) return Ok("Enter password!");
        if (password.Length < 6) return Ok("Lenght of a password must be at least 8 characters!");
        if (password.Length > 20) return Ok("Lenght of a password must not exceed 30 characters!");

        if (string.IsNullOrEmpty(conformationPassword)) return Ok("Please conform your password!");
        if (conformationPassword != password) return Ok("Both passwords need to match!");

        if (string.IsNullOrEmpty(email)) return Ok("Please enter your email adress!");
        if (email.Length > 50) return Ok("Lenght of your email adress must not exceed 50 characters!");

        if(string.IsNullOrEmpty(opis)) return Ok("Please enter your describe!");
        if(opis.Length>300) return Ok("Lenght of your describe must not exceed 300 characters!");

        if(string.IsNullOrEmpty(grad)) return Ok("Please enter the town!");
        if(grad.Length>30) return Ok("Lenght of town must not exceed 30 characters!");

        if(string.IsNullOrEmpty(adresa)) return Ok("Please enter your address!");
        if(adresa.Length>100) return Ok("Lenght of your address must not exceed 100 characters!");

        if(string.IsNullOrEmpty(vrsta)) return Ok("Please enter the type!");
        if(vrsta.Length>15) return Ok("Lenght of your type must not exceed 15 characters!");

        if(string.IsNullOrEmpty(naziv)) return Ok("Please enter the name!");
        if(naziv.Length>50) return Ok("Lenght of your type must not exceed 50 characters!");

        Random rnd=new Random();
        byte[] passwordHash, passwordSalt;
        CreatePasswordHash(password, out passwordHash, out passwordSalt);
        var salt=passwordSalt;

        var lokacija=await Context.Gradovi.Where(p=>p.Naziv==grad).FirstOrDefaultAsync();
        if(lokacija==null)
        {
            return BadRequest("Ovaj grad ne postoji!");
        }

        var objekat = new UgostiteljskiObjekat
        {
            UserName=username,
            Email=email,
            Konf_broj=rnd.Next(1,1000000),
            Uloga="UgostiteljskiObjekat",
            Opis=opis,
            Vrsta=vrsta,
            MapX=x,
            MapY=y,
            Adresa=adresa,
            Password=passwordHash,
            Salt=passwordSalt,
            Stolovi=new List<Sto>(),
            Grad=lokacija,
            Nalog_verifikovan=false,
            Ocene=new List<Ocena>(),
            Naziv=naziv,
            PetFriendly=pet,
            DozvoljenoPusenje=pusenje,
            ProsecnaOcena=0.0
        };

        try
        {
            Context.UgostiteljskiObjekti.Add(objekat);
            lokacija.UgostiteljskiObjekti!.Add(objekat);
            Context.Gradovi.Update(lokacija);
            await Context.SaveChangesAsync();

            var verifyClient=await Context.UgostiteljskiObjekti.Where(p=>p.UserName==username).FirstOrDefaultAsync();
            Verification(verifyClient!);
            return Ok(objekat);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    

    

    private static async void Verification(UgostiteljskiObjekat korisnik)
    {
        String poruka;
        poruka = $"Dear {korisnik.Naziv}\n\nAn account has been created by our manager, please conform your identity by clicking on the link below.\n" +
                "http://localhost:5268/UgostiteljskiObjekat/VerifikacijaUgostiteljskihObjekata/" + korisnik.ID_Korisnik + "/"+ korisnik.Konf_broj + "\n\nWelcome to WhereToGo?";
        SmtpClient Client = new SmtpClient()
        {
            Host = "smtp.outlook.com",
            Port = 587,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential()
            {
                UserName = "wheretogo2023@outlook.com",
                Password = "wheretogo123!"
            }
        };
        MailAddress fromMail = new MailAddress("wheretogo2023@outlook.com", "WhereToGo");
        MailAddress toMail = new MailAddress(korisnik.Email, korisnik.UserName);
        MailMessage message = new MailMessage()
        {
            From = fromMail,
            Subject ="Verification email",
            Body = poruka
        };

        message.To.Add(toMail);
        await Client.SendMailAsync(message);

        }

    #endregion POST

    #region DELETE

    [HttpDelete]
    [Route("ObrisiObjekat/{id}")]
    public async Task<ActionResult> ObrisiObjekat(int id)
    {
        if(id<0){return BadRequest("Pogresna vrednost za id Ugostiteljskog objekta");}

        try
        {
            var objekat=await Context.UgostiteljskiObjekti
                              .Include(p=>p.Stolovi)
                              .Include(p=>p.Grad)
                              .Include(p=>p.Ocene)
                              .Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();

            if(objekat==null){return BadRequest("Pogresan id!");}

            foreach(Sto s in objekat.Stolovi!)
            {
                Context.Stolovi.Remove(s);
            }  
             foreach(Ocena s in objekat.Ocene!)
            {
                Context.Ocena.Remove(s);
            }   

            objekat.Grad!.UgostiteljskiObjekti!.Remove(objekat);
            Context.Gradovi.Update(objekat.Grad);
            Context.UgostiteljskiObjekti.Remove(objekat);

            brisanjeProfilaObavestenje(objekat);
            await Context.SaveChangesAsync();
            return Ok("Uspesno obrisan objekat!");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

   [HttpDelete]
[Route("ObrisiOcenu/{id}")]
public async Task<ActionResult> ObrisiOcenu(int id)
{
    var ocena = await Context.Ocena
        .Include(p => p.UgostiteljskiObjekat)
        .Include(p => p.Posetilac)
        .Where(p => p.ID == id)
        .FirstOrDefaultAsync();

    if (ocena == null)
    {
        return BadRequest("Ova ocena ne postoji!");
    }

    var objekat = ocena.UgostiteljskiObjekat;
    var posetilac = ocena.Posetilac;

    Context.Ocena.Remove(ocena);
    objekat!.Ocene!.Remove(ocena);
    posetilac!.Ocene!.Remove(ocena);

    Context.UgostiteljskiObjekti.Update(objekat);
    Context.Posetioci.Update(posetilac);

    await Context.SaveChangesAsync();

    return Ok("Uspesno obrisana ocena!");
}

    
    public static async void brisanjeProfilaObavestenje(UgostiteljskiObjekat objekat)
    {
        String poruka;
        poruka = $"Dear {objekat.UserName}\n\nYour account has been successfully deleted.\n" +
                "\n\nBest Regards\nWhereToGo?";
        SmtpClient Client = new SmtpClient()
        {
            Host = "smtp.outlook.com",
            Port = 587,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential()
            {
                UserName = "wheretogo2023@outlook.com",
                Password = "wheretogo123!"
            }
        };
        MailAddress fromMail = new MailAddress("wheretogo2023@outlook.com", "WhereToGo");
        MailAddress toMail = new MailAddress(objekat.Email, objekat.UserName);
        MailMessage message = new MailMessage()
        {
            From = fromMail,
            Subject ="Account deletion",
            Body = poruka
        };

        message.To.Add(toMail);
        await Client.SendMailAsync(message);
    }

    #endregion DELETE

    #region PUT

    [HttpPut]
    [Route("PromeniPassword/{id}/{stari}/{novi}")]
    public async Task<ActionResult> PromeniPassword(int id, string stari, string novi)
    {
        if(id<0){return BadRequest("Neispravan id.");}
        try
        {
            var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();
            if(objekat==null){return BadRequest("Ovaj ugostiteljski objekat ne postoji!");}
            string stari_pass, stari_salt;

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                stari_salt = System.Text.Encoding.UTF8.GetString(hmac.Key);
                stari_pass = BitConverter.ToString((hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(stari)))).Replace("-", "");
            }
            if(!VerifyPasswordHash(stari, objekat.Password, objekat.Salt)){return BadRequest("Uneli ste pogresan stari password!");}
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(novi, out passwordHash, out passwordSalt);
            objekat.Password=passwordHash;
            objekat.Salt=passwordSalt;

            Context.UgostiteljskiObjekti.Update(objekat);
            await Context.SaveChangesAsync();
            return Ok("Izmenjena lozinka!");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut]
    [Route("IzmeniPodatkePet/{id}/{naziv}/{opis}/{vrsta}/{username}/{pet}/{smoking}")]
    public async Task<ActionResult> IzmeniPodatkePet(int id, string naziv, string opis, string vrsta, string username,
    bool pet, bool smoking)
    {
        if(string.IsNullOrEmpty(naziv)) return BadRequest("Morate uneti novo ime!");
        if(string.IsNullOrEmpty(opis)) return BadRequest("Morate uneti novo prezime!");
        if(string.IsNullOrEmpty(vrsta)) return BadRequest("Morate uneti novi username!");

        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();
        if(objekat==null) return BadRequest("Ovaj posetilac ne postoji!");
        if(objekat.UserName!=username)
        {
        foreach(var p in Context.UgostiteljskiObjekti.ToList())
        {
            if(p.UserName.CompareTo(username)==0)
            {
                return BadRequest("Vec postoji korisnik koji ima isti Username!");
            }
        }
        }
        objekat.Naziv=naziv;
        objekat.Opis=opis;
        objekat.Vrsta=vrsta;
        objekat.UserName=username;
        objekat.PetFriendly=pet;
        objekat.DozvoljenoPusenje=smoking;
        Context.UgostiteljskiObjekti.Update(objekat);
        await Context.SaveChangesAsync();
        return Ok(objekat);

    }

    [HttpPut]
    [Route("IzmeniPodatke/{id}/{naziv}/{opis}/{vrsta}/{username}")]
    public async Task<ActionResult> IzmeniPodatke(int id, string naziv, string opis, string vrsta, string username)
    {
        if(string.IsNullOrEmpty(naziv)) return BadRequest("Morate uneti novo ime!");
        if(string.IsNullOrEmpty(opis)) return BadRequest("Morate uneti novo prezime!");
        if(string.IsNullOrEmpty(vrsta)) return BadRequest("Morate uneti novi username!");

        var objekat=await Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefaultAsync();
        if(objekat==null) return BadRequest("Ovaj posetilac ne postoji!");
        foreach(var p in Context.UgostiteljskiObjekti.ToList())
        {
            if(p.UserName.CompareTo(username)==0)
            {
                return BadRequest("Vec postoji korisnik koji ima isti Username!");
            }
        }
        objekat.Naziv=naziv;
        objekat.Opis=opis;
        objekat.Vrsta=vrsta;
        objekat.UserName=username;
        Context.UgostiteljskiObjekti.Update(objekat);
        await Context.SaveChangesAsync();
        return Ok(objekat);

    }

    #endregion PUT

    private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        if (password == null) throw new ArgumentNullException("password");
        if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

        using (var hmac = new System.Security.Cryptography.HMACSHA512())
        {
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }

     private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
    {
        if (password == null) throw new ArgumentNullException("password");
        if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
        if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
        if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

        using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
        {
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != storedHash[i]) return false;
            }
        }

        return true;
    }
}
