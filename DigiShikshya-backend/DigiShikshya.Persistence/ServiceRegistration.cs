
using System.Data;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;



public static class ServiceRegistration
{
        public static void AddPersistenceServices(this IServiceCollection services, string connectionString)
        {
                //Register database connection
                services.AddScoped<IDbConnection>(x => new NpgsqlConnection(connectionString));


                // Register repositories

                services.AddScoped<ICourseRepository, CourseRepository>();
                services.AddScoped<ISemesterRepository, SemesterRepository>();
                services.AddScoped<ISubjectRepository, SubjectRepository>();
                services.AddScoped<IBatchRepository, BatchRepository>();
                services.AddScoped<IMaterialRepository, MaterialRepository>();
                services.AddScoped<IAssignmentRepository, AssignmentRepository>();
                services.AddScoped<ISubmissionRepository, SubmissionRepository>();
                services.AddScoped<ITeacherAssignRepository, TeacherAssignRepository>();
                services.AddScoped<IUserRepository, UserRepository>();
        }
}

