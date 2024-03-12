using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebTemplate.Migrations
{
    /// <inheritdoc />
    public partial class m : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Gradovi",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gradovi", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Posetioci",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salt = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Uloga = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NalogVerifikovan = table.Column<bool>(type: "bit", nullable: false),
                    KonfBroj = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posetioci", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "UgostiteljskiObjekti",
                columns: table => new
                {
                    IDKorisnik = table.Column<int>(name: "ID_Korisnik", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nalogverifikovan = table.Column<bool>(name: "Nalog_verifikovan", type: "bit", nullable: false),
                    Konfbroj = table.Column<int>(name: "Konf_broj", type: "int", nullable: false),
                    Uloga = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salt = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Vrsta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PetFriendly = table.Column<bool>(type: "bit", nullable: false),
                    DozvoljenoPusenje = table.Column<bool>(type: "bit", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MapX = table.Column<float>(type: "real", nullable: false),
                    MapY = table.Column<float>(type: "real", nullable: false),
                    ProsecnaOcena = table.Column<double>(type: "float", nullable: false),
                    GradID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UgostiteljskiObjekti", x => x.IDKorisnik);
                    table.ForeignKey(
                        name: "FK_UgostiteljskiObjekti_Gradovi_GradID",
                        column: x => x.GradID,
                        principalTable: "Gradovi",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Ocena",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UgostiteljskiObjekatIDKorisnik = table.Column<int>(name: "UgostiteljskiObjekatID_Korisnik", type: "int", nullable: true),
                    Vrednost = table.Column<double>(type: "float", nullable: false),
                    PosetilacID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ocena", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Ocena_Posetioci_PosetilacID",
                        column: x => x.PosetilacID,
                        principalTable: "Posetioci",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Ocena_UgostiteljskiObjekti_UgostiteljskiObjekatID_Korisnik",
                        column: x => x.UgostiteljskiObjekatIDKorisnik,
                        principalTable: "UgostiteljskiObjekti",
                        principalColumn: "ID_Korisnik");
                });

            migrationBuilder.CreateTable(
                name: "Slike",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Pictures = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UgostiteljskiObjekatIDKorisnik = table.Column<int>(name: "UgostiteljskiObjekatID_Korisnik", type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Slike", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Slike_UgostiteljskiObjekti_UgostiteljskiObjekatID_Korisnik",
                        column: x => x.UgostiteljskiObjekatIDKorisnik,
                        principalTable: "UgostiteljskiObjekti",
                        principalColumn: "ID_Korisnik");
                });

            migrationBuilder.CreateTable(
                name: "Stolovi",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tip = table.Column<int>(type: "int", nullable: true),
                    Kapacitet = table.Column<int>(type: "int", nullable: false),
                    UgostiteljskiObjekatIDKorisnik = table.Column<int>(name: "UgostiteljskiObjekatID_Korisnik", type: "int", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    PoslednjaRezervacija = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stolovi", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Stolovi_UgostiteljskiObjekti_UgostiteljskiObjekatID_Korisnik",
                        column: x => x.UgostiteljskiObjekatIDKorisnik,
                        principalTable: "UgostiteljskiObjekti",
                        principalColumn: "ID_Korisnik");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ocena_PosetilacID",
                table: "Ocena",
                column: "PosetilacID");

            migrationBuilder.CreateIndex(
                name: "IX_Ocena_UgostiteljskiObjekatID_Korisnik",
                table: "Ocena",
                column: "UgostiteljskiObjekatID_Korisnik");

            migrationBuilder.CreateIndex(
                name: "IX_Slike_UgostiteljskiObjekatID_Korisnik",
                table: "Slike",
                column: "UgostiteljskiObjekatID_Korisnik");

            migrationBuilder.CreateIndex(
                name: "IX_Stolovi_UgostiteljskiObjekatID_Korisnik",
                table: "Stolovi",
                column: "UgostiteljskiObjekatID_Korisnik");

            migrationBuilder.CreateIndex(
                name: "IX_UgostiteljskiObjekti_GradID",
                table: "UgostiteljskiObjekti",
                column: "GradID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ocena");

            migrationBuilder.DropTable(
                name: "Slike");

            migrationBuilder.DropTable(
                name: "Stolovi");

            migrationBuilder.DropTable(
                name: "Posetioci");

            migrationBuilder.DropTable(
                name: "UgostiteljskiObjekti");

            migrationBuilder.DropTable(
                name: "Gradovi");
        }
    }
}
