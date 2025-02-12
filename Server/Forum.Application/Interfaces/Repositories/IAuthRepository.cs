﻿using Microsoft.AspNetCore.Identity;
using Forum.Domain.UserAggregate;

namespace Forum.Application.Interfaces.Repositories;

public interface IAuthRepository
{
    Task<User> FindByEmailAsync(string email, CancellationToken cancellationToken);
    Task<IdentityResult> RemoveTokenAsync(string token, CancellationToken cancellationToken);
}
