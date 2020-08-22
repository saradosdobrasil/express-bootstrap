"use strict";

class Retangulo {

    constructor(altura, largura) {
        this.altura = altura;
        this.largura = largura;
    }

    // getter
    get area() {
        return this.calculaArea()
    }

    calculaArea() {
        return this.altura * this.largura;
    }
}

module.exports = Retangulo;