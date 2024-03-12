namespace Models
{
   
    public enum VrstaStola
    {
        Barski,
        Separe,
        Niski_sto,
        Sank  
    }
    public enum StatusStola
    {
        Slobodan,
        Rezervisan,
        Zauzet
    }
     [Table("Stolovi")]
    public class Sto
    {
        public int ID { get; set; }
        public VrstaStola? Tip { get; set; }
        public int Kapacitet { get; set; }
        [JsonIgnore]
        public UgostiteljskiObjekat? UgostiteljskiObjekat { get; set; }
        public StatusStola? Status { get; set; }
        public DateTime PoslednjaRezervacija { get; set; }
    }
}