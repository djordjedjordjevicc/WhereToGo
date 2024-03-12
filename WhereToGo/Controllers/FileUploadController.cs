namespace WebTemplate.Controllers;

[ApiController]
[Route("[controller]")]
public class FileUploadController : ControllerBase
{
    public ProjekatContext Context { get; set; }
    public IConfiguration Config { get; set; }
    public static IWebHostEnvironment? _webHostEnvironment;

    public FileUploadController(ProjekatContext context, IConfiguration config, IWebHostEnvironment webHostEnvironment)
    {
        Context = context;
        Config=config;
        _webHostEnvironment = webHostEnvironment;
    }

    [Route("PostPictureHostingObject/{id:int}")]
    [HttpPost]
    public IActionResult HostingObjectPost([FromRoute]int id, [FromForm]IFormFile file)
    {
        try
        {
            if (file.Length > 0)
            {
                string path = "C:\\Users\\djordje\\OneDrive - Faculty of Electronic Engineering\\Radna površina\\WhereToGO-Predaja\\Where To Go\\WhereToGo\\Slike\\" + id + "\\";
                Console.WriteLine(path);
                if (!System.IO.Directory.Exists(path))
                {
                    System.IO.Directory.CreateDirectory(path);
                }
                using (FileStream fileStream = System.IO.File.Create(path + file.FileName))
                {
                    file.CopyTo(fileStream);
                    fileStream.Flush();
                    return Ok("Upload done");
                }
            }
            else
            {
                return BadRequest("Upload failed");
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetPictureHostingObject/{id}")]
    public  IActionResult HostingObjectGet(int id)
    {
        string path =  "C:\\Users\\djordje\\OneDrive - Faculty of Electronic Engineering\\Radna površina\\WhereToGO-Predaja\\Where To Go\\WhereToGo\\Slike\\" + id + "\\";
        var images = Directory.GetFiles(path, "*.*", SearchOption.AllDirectories).ToList();
        var files = new List<byte[]>();
        foreach (var image in images)
        {
            byte[] b = System.IO.File.ReadAllBytes(image);
            files.Add(b);
        }
        return Ok(files);
    }
//C:\Users\mlade\Desktop\Where To Go\WhereToGo\Slike
}