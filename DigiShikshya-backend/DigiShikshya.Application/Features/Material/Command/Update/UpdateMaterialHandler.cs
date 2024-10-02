using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace DigiShikshya.Application.Features.Material.Command.Update
{
    public class UpdateMaterialHandler : IRequestHandler<UpdateMaterial, UpdateMaterialResponse>
    {
        private readonly IMaterialRepository _materialRepository;

        public UpdateMaterialHandler(IMaterialRepository materialRepository)
        {
            _materialRepository = materialRepository;
        }

        public async Task<UpdateMaterialResponse> Handle(UpdateMaterial request, CancellationToken cancellationToken)
        {
            var response = new UpdateMaterialResponse();
            var validator = new UpdateMaterialValidator();
            var validationResult = validator.Validate(request);

            if (!validationResult.IsValid)
            {
                response.IsSuccess = false;
                response.Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
                return response;
            }

            // Retrieve the existing material
            var existingMaterial = await _materialRepository.GetMaterialById(request.Id);
            if (existingMaterial == null)
            {
                return new UpdateMaterialResponse
                {
                    Status = "Bad Request",
                    Message = "Validation failed",
                    Errors = new List<string> { "Material could not be found." }
                };
            }

            // Apply updates to the existingMaterial entity
            existingMaterial.SubjectId = request.NewSubjectId != Guid.Empty ? request.NewSubjectId : existingMaterial.SubjectId;
            existingMaterial.Title = request.NewTitle ?? existingMaterial.Title;
            existingMaterial.Description = request.NewDescription ?? existingMaterial.Description;
            existingMaterial.ContentType = request.NewContentType ?? existingMaterial.ContentType;
            existingMaterial.Content = request.NewContent != null ? await ConvertToByteArray(request.NewContent) : existingMaterial.Content;
            existingMaterial.UpdatedAt = DateTime.Now;

            // Update the material in the repository
            var success = await _materialRepository.UpdateMaterial(existingMaterial);

            return new UpdateMaterialResponse
            {
                Status = success ? "Success" : "Failed",
                Message = success ? "Material updated successfully" : "Failed to update material",
                Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
            };
        }
        private async Task<byte[]> ConvertToByteArray(IFormFile content)
        {
            using var memoryStream = new MemoryStream();
            await content.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }
    }

}