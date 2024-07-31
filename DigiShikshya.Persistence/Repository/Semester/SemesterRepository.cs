using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

public class SemesterRepository(IDbConnection _dbConnection) : ISemesterRepository
{

    public async Task<bool> AddSemester(Semester semester)
    {
        var query = @"INSERT INTO semester 
                      (id, semester_name, start_date, end_date, created_at) 
                      VALUES 
                      (@Id, @SemesterName, @StartDate, @EndDate, @CreatedAt)";

        var result = await _dbConnection.ExecuteAsync(query, semester);
        return result > 0;
    }

    public async Task<bool> DeleteSemester(Guid id)
    {
        var query = "DELETE FROM semester WHERE id = @Id";
        var result = await _dbConnection.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }

    public async Task<PaginatedResult<Semester>> GetAllSemesters(SemesterListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM semester";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"SELECT * FROM semester 
                      ORDER BY created_at DESC 
                      OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var result = await _dbConnection.QueryAsync<Semester>(query, new
        {
            Offset = (request.Page - 1) * request.PageSize,
            PageSize = request.PageSize
        });

        return new PaginatedResult<Semester>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }

    public async Task<Semester> GetSemesterById(Guid id)
    {
        var query = "SELECT * FROM semester WHERE id = @Id";
        var result = await _dbConnection.QuerySingleOrDefaultAsync<Semester>(query, new { Id = id });
        return result;
    }

    public async Task<bool> UpdateSemester(Semester semester)
    {
        var query = @"UPDATE semester 
                      SET semester_name = @SemesterName, 
                          start_date = @StartDate, 
                          end_date = @EndDate,
                          updated_at = @UpdatedAt, 
                      WHERE id = @Id";

        var result = await _dbConnection.ExecuteAsync(query, semester);
        return result > 0;
    }
}
