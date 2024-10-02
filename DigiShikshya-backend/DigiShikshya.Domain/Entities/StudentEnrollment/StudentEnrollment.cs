public class StudentEnrollment : Base
{
    public Guid StudentId { get; set; }
    public Guid BatchId { get; set; }
    public Guid SemesterId { get; set; }
    public DateTime EnrolledDate { get; set; }
}
