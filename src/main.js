import "./css/index.css"
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
    const colors = {
        "visa": ["#436D99","#2D57F2"],
        "mastercard": ["#C69347","#DF6F29"],   
        "default": ["black","gray"],
    }

    //acessando passando o type como variavel e dizendo posição da cor
    ccBgColor01.setAttribute("fill",colors[type][0])
    ccBgColor02.setAttribute("fill",colors[type][1])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
}

//aqui chamo a function e passo o parametro utilizado no set attribute.
//globalThis.setCardType = setCardType
//setCardType("default")



//--------Security Code-----------//
// Poderia usar o get element by id, mas para padronizar utilizamos o querySelector.
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
    mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)



//--------Expiration Date-----------//
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        MM:{
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        YY:{
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        },

    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)



//--------CardMask-----------//
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
    ],
    //appended toda vez q clicar em um botão ele é acionado. Essa function é proria do dynamic masked esta na documentação.
    dispatch: function(appended, dynamicMasked) {
        // ele pega o atual valor e concatena com o proximo q foi digitado se nao for digito (Ex: A) ele deixa vazio, pegando apenas numeros.
        const number = (dynamicMasked.value + appended).replace(/\D/g,"")

        //procurar no array de mascara (find é função que aceita função como parametro), roda uma funçao
        //que verifica se o number bate com o regex do compiledmasks(que é o array, que vai como parametro de nome arrayMask pra function ) e retorna:
        //O number, bate com o arrayMask.regex? se sim retorna o item que bateu a validação.
        const foundMask = dynamicMasked.compiledMasks.find(
            function(arrayMask){
                return number.match(arrayMask.regex)
            }
        );

        //após validação retorna da função do dispatch a mascara que achou
        return foundMask
    }
}
const cardNumberMasked = IMask(cardNumber,cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
    alert("Cartão adicionado")
})

/* para não dar refresh no form. o Evento que está na function é o evento atual que seria o submit

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
}
)*/

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input",() =>{
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = cardHolder.value.length > 0 ? cardHolder.value : "Fulano da Silva"
})

//on é a mesma logica do addeventlistener, no accept é se ele atende as regras definidas do iMask
securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(securityCode) {
    const ccSecurity = document.querySelector(".cc-security .value")

    ccSecurity.innerText = securityCode.length > 0 ? securityCode : "123"
}

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(cardNumber) {
    const ccNumber = document.querySelector(".cc-number")

    ccNumber.innerText = cardNumber.length > 0 ? cardNumber : "1234 5678 9012 3456"
}

expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
    const ccDate = document.querySelector(".cc-extra .value")

    ccDate.innerText = date.length > 0 ? date : "02/32" 
}