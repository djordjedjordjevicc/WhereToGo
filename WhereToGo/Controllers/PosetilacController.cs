namespace WebTemplate.Controllers;

[ApiController]
[Route("[controller]")]
public class PosetilacController : ControllerBase
{
    public ProjekatContext Context { get; set; }
    public IConfiguration Config { get; set; }

    public PosetilacController(ProjekatContext context, IConfiguration config)
    {
        Context = context;
        Config=config;
    }

    #region GET
    
    [HttpGet]
    [Route("VratiPosetioce")]
    public async Task<ActionResult> VratiPosetioce()
    {
        var posetioci=await Context.Posetioci.ToListAsync();
        return Ok(posetioci);
    }

    [HttpGet]
    [Route("VratiPosetioca/{idPosetioca}")]
    public async Task<ActionResult> VratiPosetioca(int idPosetioca)
    {
        var posetilac=await Context.Posetioci.Where(p=>p.ID==idPosetioca).FirstOrDefaultAsync();
        if(posetilac!=null)
        {
            return Ok(posetilac);
        }
        else
        {
            return BadRequest("Posetilac nije nadjen!");
        }
    }


    #region LOGIN

    [HttpGet]
    [Authorize]
    public IActionResult PosetilacEndPoint()
    {
        var trenutniPosetilac=GetTrenutniPosetilac();
        return Ok(trenutniPosetilac);
    }

    [AllowAnonymous]
    [HttpGet]
    [Route("LogInPosetilac/{Username}/{password}")]
    public async Task<ActionResult> LogInPosetilac(string Username, string password)
    {
        var klijent=await Context.Posetioci.Where(p=>p.Username==Username).FirstOrDefaultAsync();
        if(klijent==null) return Ok(null);
        if(VerifyPasswordHash(password, klijent.Password, klijent.Salt))
        {
            return Ok(klijent);
        }
        else
        {
            return Ok(null);
        }
    }

    [AllowAnonymous]
    [HttpGet]
    [Route("NalogVerifikovan/{id}")]
    public bool nalogVerifikovan(int id)
    {
        var ugostiteljskiObj=Context.UgostiteljskiObjekti.Where(p=>p.ID_Korisnik==id).FirstOrDefault();
        if(ugostiteljskiObj==null)
        {
            var posetilac=Context.Posetioci.Where(p=>p.ID==id).FirstOrDefault();
            return (posetilac!.NalogVerifikovan);
        }
        return (ugostiteljskiObj.Nalog_verifikovan);
    }

    private Posetilac GetTrenutniPosetilac()
    {
        var identity = HttpContext.User.Identity as ClaimsIdentity;

        if (identity != null)
        {
            var userClaims = identity.Claims;
            int ID = int.Parse(userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Sid)!.Value);

            return new Posetilac
            {
                Username = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)!.Value,
                Email = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)!.Value,
                Uloga = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)!.Value,
                ID = ID,
                Ime = userClaims.FirstOrDefault(o => o.Type == "Ime")!.Value,
                Prezime = userClaims.FirstOrDefault(o => o.Type == "Prezime")!.Value,
                Password = Convert.FromBase64String(userClaims.FirstOrDefault(o => o.Type == "Password")!.Value),
                Salt = Convert.FromBase64String(userClaims.FirstOrDefault(o => o.Type == "Salt")!.Value),
            };
        }

        throw new InvalidOperationException("Identity not found or does not contain necessary claims.");
    }
    

    [AllowAnonymous]
    [HttpPost]
    [Route("GetToken")]
    public async Task<ActionResult> GetToken([FromBody] KorisnikAuth user)
    {
        var korisnik=await Context.Posetioci.Where(k=>k.Username==user.username).FirstOrDefaultAsync();
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

    private string Generate(Posetilac korisnik)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config["Jwt:Key"]?? string.Empty));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, korisnik.Username),
            new Claim(ClaimTypes.Email, korisnik.Email),
            new Claim(ClaimTypes.Role, korisnik.Uloga),
            new Claim(ClaimTypes.Sid, korisnik.ID.ToString())
        };

        var token = new JwtSecurityToken(Config["Jwt:Issuer"],
            Config["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);

    }

    #endregion LOGIN

    [HttpGet]
    [Route("VratiKorisnika/{id}")]
    public async Task<ActionResult> VratiKorisnika(int id)
    {
        var korisnik=await Context.Posetioci.Where(p=>p.ID==id).FirstOrDefaultAsync();
        return Ok(korisnik);
    }

    [Route("VerifikacijaKlijenta/{id}/{konf}")]
    [HttpGet]
    public async Task<ActionResult> VerifikacijaKlijenta(int id, int konf)
    {
        var korisnik = Context.Posetioci.Where(k => k.ID == id).FirstOrDefault();

        if (korisnik!.KonfBroj != konf)
            return Ok("Bad Conformation number");

        korisnik.NalogVerifikovan = true;

        Context.Posetioci.Update(korisnik);

        await Context.SaveChangesAsync();
        
        
        return Ok("Your account has been successfully verified, you can now log in into your account.");
        
    }

    #endregion GET

    #region DELETE

    [HttpDelete]
    [Route("IzbrisiPosetioca/{id}")]
    public async Task<ActionResult> IzbrisiPosetioca(int id)
    {
        if(id<0) return BadRequest("Pogresna vrednost za id posetioca!");
        try
        {
            var posetilac= await Context.Posetioci.Where(p=>p.ID==id).FirstOrDefaultAsync();
            if(posetilac!=null)
            {
                brisanjeProfilaObavestenje(posetilac);
               
                Context.Posetioci.Remove(posetilac);
                await Context.SaveChangesAsync();
                return Ok("Posetilac uspesno izbrisan!");
            }
            else
            {
                return Ok("Takav posetilac ne postoji!");
            }
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    public static async void brisanjeProfilaObavestenje(Posetilac client)
    {
        string poruka;
        poruka = $"Dear {client.Ime}\n\nYou account has been successfully deleted.\n" +
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
        MailAddress toMail = new MailAddress(client.Email, client.Ime);
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

    #region POST

    
    [HttpPost]
    [Route("UnosPosetioca/{Username}/{password}/{conformationPassword}/{ime}/{prezime}/{email}")]
    public async Task<ActionResult> UnosPosetioca(string Username, string password, string conformationPassword, string ime, string prezime, string email)
    {
        
        if(string.IsNullOrEmpty(Username)) return Ok("Please enter your Username!");
        if(Username.Length>20) return Ok("Lenght of your Username must not exceed 20 characters!");

        if (string.IsNullOrEmpty(password)) return Ok("Enter password!");
        if (password.Length < 8) return Ok("Lenght of a password must be at least 8 characters!");
        if (password.Length > 30) return Ok("Lenght of a password must not exceed 30 characters!");

        if (string.IsNullOrEmpty(conformationPassword)) return Ok("Please conform your password!");
        if (conformationPassword != password) return Ok("Both passwords need to match!");

        if (string.IsNullOrEmpty(ime)) return Ok("Please enter your name!");
        if (ime.Length > 20) return Ok("Lenght of your name must not exceed 20 characters!");

        if (string.IsNullOrEmpty(prezime)) return Ok("Please enter your last name!");
        if (prezime.Length > 20) return Ok("Lenght of your last name must not exceed 20 characters!");

        if (string.IsNullOrEmpty(email)) return Ok("Please enter your email adress!");
        if (email.Length > 50) return Ok("Lenght of your email adress must not exceed 50 characters!");
       
        Random rnd=new Random();

        byte[] passwordHash, passwordSalt;
        CreatePasswordHash(password, out passwordHash, out passwordSalt);
        var salt=passwordSalt;

        var posetilac = new Posetilac
        {
            Username=Username,
            Password=passwordHash,
            Email=email,
            Ime=ime,
            Prezime=prezime,
            Salt=passwordSalt,
            KonfBroj=rnd.Next(1,1000000),
            NalogVerifikovan=false,
            Uloga="Posetilac"
        };

       
        foreach(var p in Context.Posetioci.ToList())
        {
            if(p.Username.CompareTo(Username)==0)
            {
                return Ok("Username is already taken!");
            }
             if(p.Email.CompareTo(email)==0)
            {
                return Ok("An account with this email adress already exists!");
            }
        }

       
        try
        {
            Context.Posetioci.Add(posetilac);
           
            await Context.SaveChangesAsync();

            var verifyClient = await Context.Posetioci.Where(k => k.Email == email).FirstOrDefaultAsync();

            try { Verification(verifyClient!); }
            catch (Exception)
            {
               
                return Ok("This is not a valid email adress!");
            }
            
            return Ok(posetilac);
        }

        catch(Exception e)
        {
            
            return BadRequest(e.Message);
            
        }
    }



    #endregion POST

    #region PUT

    [HttpPut]
    [Route("Promeni_Username/{stari}/{novi}")]
    public async Task<ActionResult> Promeni_Username(string stari, string novi)
    {
        if(string.IsNullOrEmpty(stari)) return BadRequest("Ovaj Username ne postoji!");
        try
        {
            var posetilac=await Context.Posetioci.Where(p=>p.Username==stari).FirstOrDefaultAsync();
            if(posetilac==null) return BadRequest("Ovaj Username ne postoji!");
            foreach(var p in Context.Posetioci.ToList())
            {
                if(p.Username.CompareTo(novi)==0)
                {
                    return BadRequest("Vec postoji klijent koji ima isti Username!");
                }
            }
            posetilac.Username=novi;
            Context.Posetioci.Update(posetilac);
            await Context.SaveChangesAsync();
            return Ok("Izmenjen Username! Novi Username je:{novi}");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut]
    [Route("IzmeniPodatke/{id}/{ime}/{prezime}/{username}")]
    public async Task<ActionResult> IzmeniPodatke(int id, string ime, string prezime, string username)
    {
        if(string.IsNullOrEmpty(ime)) return BadRequest("Morate uneti novo ime!");
        if(string.IsNullOrEmpty(prezime)) return BadRequest("Morate uneti novo prezime!");
        if(string.IsNullOrEmpty(username)) return BadRequest("Morate uneti novi username!");

        var posetilac=await Context.Posetioci.Where(p=>p.ID==id).FirstOrDefaultAsync();
        if(posetilac==null) return BadRequest("Ovaj posetilac ne postoji!");
        if(posetilac.Username!=username)
        {
        foreach(var p in Context.Posetioci.ToList())
        {
            if(p.Username.CompareTo(username)==0)
            {
                return BadRequest("Vec postoji korisnik koji ima isti Username!");
            }
        }
        }
        posetilac.Username=username;
        posetilac.Ime=ime;
        posetilac.Prezime=prezime;
        Context.Posetioci.Update(posetilac);
        await Context.SaveChangesAsync();
        return Ok(posetilac);

    }

    [HttpPut]
    [Route("PromeniPassword/{id}/{stari}/{novi}")]
    public async Task<ActionResult> PromeniPassword(int id, string stari, string novi)
    {
        if(id<0) return BadRequest("Ovaj posetilac ne postoji!");
        try
        {
            var posetilac=await Context.Posetioci.Where(p=>p.ID==id).FirstOrDefaultAsync();
            if(posetilac==null) return BadRequest("Ocaj klijent ne postoji!");

            if(!VerifyPasswordHash(stari, posetilac.Password, posetilac.Salt))
            {
                 return BadRequest("Uneli ste pogresan stari password");

            }
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(novi, out passwordHash, out passwordSalt);
            posetilac.Password=passwordHash;
            posetilac.Salt=passwordSalt;

            Context.Posetioci.Update(posetilac);
            await Context.SaveChangesAsync();

            return Ok("Izmenjena lozinka!");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    [Route("ProveraUsernameDuplikata/{id}/{Username}")]
    public async Task<ActionResult> ProveraUsernameDuplikata(int id, string Username)
    {
        var korisnik=await Context.Posetioci.Where(p=>p.ID==id && p.Username==Username).FirstOrDefaultAsync();
        if(korisnik==null)
        {
            return Ok(true);

        }
        else
        {
            return Ok(false);
        }
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

        
    private static async void Verification(Posetilac korisnik)
    {
        String poruka;
        poruka = $"Dear {korisnik.Ime}\n\nAn account has been created on our WhereToGo? web page, please conform your identity by clicking on the link below.\n" +
                "https://localhost:7193/Posetilac/VerifikacijaKlijenta/" + korisnik.ID + "/"+ korisnik.KonfBroj + "\n\nBest Regards\nWhereToGo?";
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
        MailAddress toMail = new MailAddress(korisnik.Email, korisnik.Username);
        MailMessage message = new MailMessage()
        {
            From = fromMail,
            Subject = "Verifikacioni email",
            Body = poruka
        };

        message.To.Add(toMail);
        await Client.SendMailAsync(message);

    }
}
