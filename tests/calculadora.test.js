// @ts-check

test("Criando primeiro teste", function(){
    const calculadora = require("");

    test("Somar 2+2 deveria retornar 4", function(){
        const resultado = calculadora.somar(2, 2);
        expect(resultado).toBe(4);
    })
})