namespace Models
{
    [Table("Gradovi")]
    public class Grad
    {
        public int ID { get; set; }
        public required string Naziv { get; set; }
        [JsonIgnore]
        public List<UgostiteljskiObjekat>? UgostiteljskiObjekti { get; set; }

    }
}