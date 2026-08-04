using MicroERP.Api.DTOs;
using MicroERP.Api.Models;
using MicroERP.Api.Repositories.Interfaces;
using MicroERP.Api.Services;
using MicroERP.Api.Services.Exceptions;
using Moq;

namespace MicroERP.Tests.Services;

public sealed class ProdutoServiceTests
{
    private readonly Mock<IProdutoRepository> _repositoryMock = new();
    private readonly ProdutoService _service;

    public ProdutoServiceTests()
    {
        _service = new ProdutoService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ThrowsNotFoundException()
    {
        _repositoryMock
            .Setup(r => r.GetByIdAsync(1, 99, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Produto?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.GetByIdAsync(1, 99, CancellationToken.None));
    }

    [Fact]
    public async Task GetByIdAsync_WhenFound_ReturnsMappedResponse()
    {
        var produto = new Produto { Id = 1, Uuid = Guid.NewGuid(), Nome = "Produto A", Preco = 10m, QuantidadeEstoque = 5 };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(1, 1, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync(produto);

        var result = await _service.GetByIdAsync(1, 1, CancellationToken.None);

        Assert.Equal("Produto A", result.Nome);
        Assert.Equal(10m, result.Preco);
    }

    [Fact]
    public async Task CreateAsync_SavesProdutoAndReturnsResponse()
    {
        var request = new ProdutoCreateRequest { Nome = "Produto Novo", Preco = 25m, QuantidadeEstoque = 10 };

        var result = await _service.CreateAsync(1, request, CancellationToken.None);

        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Produto>(), It.IsAny<CancellationToken>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        Assert.Equal("Produto Novo", result.Nome);
        Assert.Equal(25m, result.Preco);
    }

    [Fact]
    public async Task UpdateAsync_WhenNotFound_ThrowsNotFoundException()
    {
        _repositoryMock
            .Setup(r => r.GetByIdAsync(1, 99, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Produto?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.UpdateAsync(1, 99, new ProdutoUpdateRequest { Nome = "X", Preco = 1m, QuantidadeEstoque = 1 }, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateAsync_WhenFound_UpdatesFields()
    {
        var produto = new Produto { Id = 1, Uuid = Guid.NewGuid(), Nome = "Antigo", Preco = 5m, QuantidadeEstoque = 2 };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(produto);

        var request = new ProdutoUpdateRequest { Nome = "Novo", Preco = 99m, QuantidadeEstoque = 50 };
        var result = await _service.UpdateAsync(1, 1, request, CancellationToken.None);

        Assert.Equal("Novo", result.Nome);
        Assert.Equal(99m, result.Preco);
        Assert.Equal(50, result.QuantidadeEstoque);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WhenNotFound_ThrowsNotFoundException()
    {
        _repositoryMock
            .Setup(r => r.GetByIdAsync(1, 99, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Produto?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.DeleteAsync(1, 99, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteAsync_WhenFound_SetsDeletedAt()
    {
        var produto = new Produto { Id = 1, Uuid = Guid.NewGuid(), Nome = "A", Preco = 1m };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(produto);

        await _service.DeleteAsync(1, 1, CancellationToken.None);

        Assert.NotNull(produto.DeletedAt);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
