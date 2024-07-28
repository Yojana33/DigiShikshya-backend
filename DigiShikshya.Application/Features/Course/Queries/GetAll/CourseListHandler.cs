using MediatR;

class CourseListHandler(ICourseRepository _courseRepository) : IRequestHandler<CourseListQuery, PaginatedResult<CourseListResponse>>
{
    public async Task<PaginatedResult<CourseListResponse>> Handle(CourseListQuery request, CancellationToken cancellationToken)
    {

        var courses = await _courseRepository.GetAllCourses(request);
        var response = new PaginatedResult<CourseListResponse>
        {
            Items = courses?.Items?.Select(x => new CourseListResponse
            {
                Id = x.Id,
                Name = x.CourseName,
                Description = x.CourseDescription,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,
                CreatedBy = x.CreatedBy,
                UpdatedBy = x.UpdatedBy,

            }).ToList(),
            Page = courses!.Page,
            PageSize = courses.PageSize,
            TotalCount = courses.TotalCount,
            TotalPages = courses.TotalPages
        };
        return response;
    }

}