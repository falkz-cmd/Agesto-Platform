using MicroERP.Api.DTOs;
using MicroERP.Api.Enums;
using MicroERP.Api.Models;
using MicroERP.Api.Repositories.Interfaces;
using MicroERP.Api.Services;
using MicroERP.Api.Services.Exceptions;
using Moq;

namespace MicroERP.Tests.Services;

public sealed class ItemServicoServiceTests
{
    private readonly Mock<IItemServicoRepository> _itemServicoRepoMock = new();
    private readonly Mock<IAtendimentoRepository> _atendimentoRepoMock = new();
    private readonly Mock<IServicoRepository> _servicoRepoMock = new();
    private readonly Mock<IItemProdutoRepository> _itemProdutoRepoMock = new();
    private readonly ItemServicoService _service;

    public ItemServicoServiceTests()
    {
        _service = new ItemServicoService(
            _itemServicoRepoMock.Object,
            _atendimentoRepoMock.Object,
            _servicoRepoMock.Object,
            _itemProdutoRepoMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ThrowsNotFoundException()
    {
        _itemServicoRepoMock
            .Setup(r => r.GetByIdAsync(1, 99, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync((ItemServico?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.GetByIdAsync(1, 99, CancellationToken.None));
    }

    [Fact]
    public async Task CreateAsync_WhenAtendimentoNotFound_ThrowsNotFoundException()
    {
        _atendimentoRepoMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Atendimento?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.CreateAsync(1, new ItemServicoCreateRequest { AtendimentoId = 1, ServicoId = 1, Quantidade = 1 }, CancellationToken.None));
    }

    [Fact]
    public async Task CreateAsync_WhenServicoNotFound_ThrowsNotFoundException()
    {
        _atendimentoRepoMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Atendimento { Id = 1 });

        _servicoRepoMock
            .Setup(r => r.GetByIdAsync(1, 5, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Servico?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.CreateAsync(1, new ItemServicoCreateRequest { AtendimentoId = 1, ServicoId = 5, Quantidade = 1 }, CancellationToken.None));
    }

    [Fact]
    public async Task CreateAsync_PorHora_CalculatesSubtotalCorrectly()
    {
        var atendimento = new Atendimento { Id = 1 };
        var servico = new Servico { Id = 5, TipoCobranca = TipoCobranca.PorHora, ValorHora = 100m };

        _atendimentoRepoMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(atendimento);

        _servicoRepoMock
            .Setup(r => r.GetByIdAsync(1, 5, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync(servico);

        _itemProdutoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);

        _itemServicoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(300m);

        var result = await _service.CreateAsync(1, new ItemServicoCreateRequest { AtendimentoId = 1, ServicoId = 5, Quantidade = 3 }, CancellationToken.None);

        Assert.Equal(300m, result.Subtotal); // 3 * 100
        Assert.Equal(100m, result.PrecoUnitario);
        _itemServicoRepoMock.Verify(r => r.AddAsync(It.IsAny<ItemServico>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_Empreitada_UsesValorEmpreitadaAsSubtotal()
    {
        var atendimento = new Atendimento { Id = 1 };
        var servico = new Servico { Id = 5, TipoCobranca = TipoCobranca.Empreitada, ValorEmpreitada = 500m };

        _atendimentoRepoMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(atendimento);

        _servicoRepoMock
            .Setup(r => r.GetByIdAsync(1, 5, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync(servico);

        _itemProdutoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);

        _itemServicoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(500m);

        var result = await _service.CreateAsync(1, new ItemServicoCreateRequest { AtendimentoId = 1, ServicoId = 5, Quantidade = 99 }, CancellationToken.None);

        Assert.Equal(500m, result.Subtotal);
        Assert.Equal(500m, result.PrecoUnitario);
    }

    [Fact]
    public async Task DeleteAsync_WhenNotFound_ThrowsNotFoundException()
    {
        _itemServicoRepoMock
            .Setup(r => r.GetByIdAsync(1, 99, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync((ItemServico?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.DeleteAsync(1, 99, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteAsync_WhenFound_SetsDeletedAt()
    {
        var item = new ItemServico { Id = 1, AtendimentoId = 1, ServicoId = 5 };

        _itemServicoRepoMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(item);

        _atendimentoRepoMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Atendimento { Id = 1 });

        _itemProdutoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);

        _itemServicoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);

        await _service.DeleteAsync(1, 1, CancellationToken.None);

        Assert.NotNull(item.DeletedAt);
        _itemServicoRepoMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_PorHora_ComValorInformado_SobrescreveCatalogo()
    {
        var servico = new Servico { Id = 5, TipoCobranca = TipoCobranca.PorHora, ValorHora = 100m };

        _atendimentoRepoMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Atendimento { Id = 1 });
        _servicoRepoMock
            .Setup(r => r.GetByIdAsync(1, 5, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync(servico);
        _itemProdutoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);
        _itemServicoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);

        var result = await _service.CreateAsync(1, new ItemServicoCreateRequest
        {
            AtendimentoId = 1,
            ServicoId = 5,
            PrecoUnitario = 150m, // sobrescreve ValorHora (100) conforme dificuldade
            Quantidade = 3
        }, CancellationToken.None);

        Assert.Equal(150m, result.PrecoUnitario);
        Assert.Equal(450m, result.Subtotal); // 3 * 150
    }

    [Fact]
    public async Task CreateAsync_Empreitada_ComValorInformado_IgnoraQuantidade()
    {
        var servico = new Servico { Id = 5, TipoCobranca = TipoCobranca.Empreitada, ValorEmpreitada = 500m };

        _atendimentoRepoMock
            .Setup(r => r.GetByIdAsync(1, 1, true, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Atendimento { Id = 1 });
        _servicoRepoMock
            .Setup(r => r.GetByIdAsync(1, 5, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync(servico);
        _itemProdutoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);
        _itemServicoRepoMock
            .Setup(r => r.SumSubtotalByAtendimentoAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);

        var result = await _service.CreateAsync(1, new ItemServicoCreateRequest
        {
            AtendimentoId = 1,
            ServicoId = 5,
            PrecoUnitario = 700m, // sobrescreve ValorEmpreitada (500)
            Quantidade = 99
        }, CancellationToken.None);

        Assert.Equal(700m, result.PrecoUnitario);
        Assert.Equal(700m, result.Subtotal); // empreitada ignora quantidade
    }
}
