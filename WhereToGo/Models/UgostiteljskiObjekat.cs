namespace Models
{
    [Table("UgostiteljskiObjekti")]
    public class UgostiteljskiObjekat
    {
        [Key]
        public int ID_Korisnik { get; set; }
        public required string UserName { get; set; }
        public required byte[] Password { get; set; }
        public required string Email { get; set; }
        public bool Nalog_verifikovan { get; set; }
        public int Konf_broj { get; set; }
        public required string Uloga { get; set; }
        public required byte[] Salt { get; set; }
        public required string Naziv { get; set; }
        public string? Vrsta { get; set; }
        public bool PetFriendly { get; set; }
        public bool DozvoljenoPusenje { get; set; }
        public string? Opis { get; set; }
        public string? Adresa { get; set; }
        public float MapX { get; set; }
        public float MapY { get; set; }
        public List<Ocena>? Ocene { get; set; }
        public double ProsecnaOcena { get; set; }

        [JsonIgnore]
        public Grad? Grad { get; set; }
        [JsonIgnore]
        public List<Sto>? Stolovi { get; set; }
    }

}