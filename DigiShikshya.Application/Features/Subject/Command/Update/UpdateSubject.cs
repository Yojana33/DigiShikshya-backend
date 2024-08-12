using MediatR;
using System;

public class UpdateSubject : IRequest<UpdateSubjectResponse>
{
    public required Guid Id { get; set; } 
    public Guid NewCourseSemesterId { get; set; }  
    public string? NewSubjectName { get; set; }  
    public string? NewSubjectCode { get; set; }  
    public string? NewSubjectDescription { get; set; } 
    public int? NewCreditHour { get; set; } 
}
