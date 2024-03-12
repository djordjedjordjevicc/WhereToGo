namespace Models
{
    public class Ocena
    {
        public int ID { get; set; }

        public UgostiteljskiObjekat? UgostiteljskiObjekat { get; set; }

        public double Vrednost { get; set; }
        
        public Posetilac? Posetilac { get; set; }

        
    }

}