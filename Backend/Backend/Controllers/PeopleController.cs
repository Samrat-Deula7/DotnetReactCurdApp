using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

// ok so this file PropleController.cs is the file that defines how to control the router does need to be 
// called from the program.cs directly rather i will be descovered by the program by seeing the compiled code

[Route("api/[controller]")]  // route will be api/ + className - Controller so you get api/People where Controller is minused.
[ApiController] // ok so this enables the api behaviour.

public class PeopleController : ControllerBase
{
    private readonly AppDbContext _context;

    public PeopleController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost] // says that this route handles the post request.  POST /api/people
    public async Task<IActionResult> AddPerson(Person person)
    {
        try
        {
            _context.People.Add(person);
            await _context.SaveChangesAsync();
            return Ok(person);  // will return 200 Ok status code + person object in the response body
        }
        catch ( Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,ex.Message); // Will return 500 internal server error + message in the response body
        }
    }
}