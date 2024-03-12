namespace Models;

public class ProjekatContext : DbContext
{
    public ProjekatContext(DbContextOptions options) : base(options)
    {
        
    }

    public required DbSet<Grad> Gradovi { get; set; }
    public required DbSet<Sto> Stolovi { get; set; }
    public required DbSet<UgostiteljskiObjekat> UgostiteljskiObjekti { get; set; }
    public required DbSet<Posetilac> Posetioci { get; set; }
    public required DbSet<Slike> Slike { get; set; }
    public required DbSet<Ocena> Ocena { get; set; }

    
}
