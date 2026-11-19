using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            return CreatedAtRoute("GetPerson", new { id = person.Id }, person);  // will return 201 Ok status code + location of the resource
            //  (http://localhost:1570/api/people/{id})person object in the response body
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Will return 500 internal server error + message in the response body
        }
    }

    [HttpGet] // GET /api/people
    public async Task<IActionResult> GetPeople()
    {
        try
        {
            var people = await _context.People.ToListAsync();
            return Ok(people);  // will return 200 Ok status code + person object in the response body
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Will return 500 internal server error + message in the response body
        }
    }



    [HttpGet("{id:int}", Name = "GetPerson")] // GET /api/people/1
    public async Task<IActionResult> GetPerson(int id)
    {
        try
        {
            var person = await _context.People.FindAsync(id);

            if (person is null)
            {
                return NotFound(); // 404 status code;
            }

            return Ok(person);  // will return 200 Ok status code + person object in the response body
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Will return 500 internal server error + message in the response body
        }
    }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdatePerson(int id, [FromBody] Person person) // The id will come from the url and person form the body.
    {
        try
        {
            if (id != person.Id)
            {
                return BadRequest("Ids in url and body mismatches");  // 400 + the message
            }
            if (!await _context.People.AnyAsync(p => p.Id == id))
            {
                return NotFound(); //404 not found
            }
            _context.People.Update(person);
            await _context.SaveChangesAsync();
            return NoContent(); // just returning 204 status.
            //  (http://localhost:1570/api/people/{id})person object in the response body
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Will return 500 internal server error + message in the response body
        }
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePerson(int id)
    {
        try
        {
            var person = await _context.People.FindAsync(id);

            if (person is null)
            {
                return NotFound(); // 404 status code;
            }


            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return NoContent(); // just returning 204 status.
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Will return 500 internal server error + message in the response body
        }
    }
}