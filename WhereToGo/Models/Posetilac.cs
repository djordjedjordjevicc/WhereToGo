namespace Models
{
    [Table("Posetioci")]
     public class Posetilac
    {
        public int ID { get; set; }
        public required string Username { get; set; }
        
        public required byte[] Password { get; set; }
        public required string Email { get; set; }
        public required string Ime { get; set; }
        public required string Prezime { get; set; }
        public required byte[] Salt { get; set; }
        public required string Uloga { get; set; }
        public bool NalogVerifikovan { get; set; }
        public int KonfBroj{ get; set; }
        public List<Ocena>? Ocene { get; set; }
        

    }
}