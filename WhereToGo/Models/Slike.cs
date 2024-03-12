namespace Models
{
    
    public class Slike
    {
        [Key]
        public int ID { get; set; }
        public string? Pictures { get; set; }

        public UgostiteljskiObjekat? UgostiteljskiObjekat { get; set; }


    }
}