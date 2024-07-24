public class AddNewCourseResponse
{
     public List<string>? Message  { get; set; }

    public DateTime? RequetedAt { get; set; }=DateTime.Now;
    public bool? IsSuccess { get; set; }

}