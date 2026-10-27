const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

function elemento() {
    const filhos = new Map()

    return {
        children: [],
        listeners: {},
        textContent: '',
        innerHTML: '',

        classList: {
            add() {},
            remove() {},
            toggle() {
                return true
            }
        },

        addEventListener(nome, fn) {
            this.listeners[nome] = fn
        },

        appendChild(no) {
            this.children.push(no)
        },

        querySelector(seletor) {
            if (!filhos.has(seletor)) {
                filhos.set(seletor, elemento())
            }

            return filhos.get(seletor)
        }
    }
}

test(
    'notificações exibem conteúdo como texto e só navegam dentro da plataforma',
    async () => {
        const casos = [
            ['javascript:alert(1)', ''],
            ['https://externo.test/roubar', ''],
            ['//externo.test', ''],
            ['https://user:pass@monetiza.test/x', ''],
            [
                '/minhasCompras?origem=sino#compra',
                '/minhasCompras?origem=sino#compra'
            ]
        ]

        for (const [link, esperado] of casos) {
            const nodes = new Map()
            const eventos = {}
            const pedidos = []

            const document = {
                getElementById(id) {
                    if (!nodes.has(id)) {
                        nodes.set(id, elemento())
                    }

                    return nodes.get(id)
                },

                createElement: elemento,

                addEventListener(nome, fn) {
                    eventos[nome] = fn
                }
            }

            const window = {
                location: {
                    origin: 'https://monetiza.test',
                    href: ''
                },

                i18n: {
                    t: x => x,
                    locale: () => 'pt-BR'
                }
            }

            const ataque = '<img src=x onerror=alert(1)>'

            const codigo = fs.readFileSync(
                require.resolve('../src/public/js/notificacoes.js'),
                'utf8'
            )

            vm.runInNewContext(codigo, {
                document,
                window,

                localStorage: {
                    getItem: () => 'teste'
                },

                URL,
                console,

                fetch: async (url, opts) => {
                    pedidos.push([url, opts])

                    return {
                        ok: true,

                        json: async () =>
                            url.endsWith('nao-lidas')
                                ? { total: 1 }
                                : [
                                    {
                                        id: 1,
                                        tipo: 'venda',
                                        titulo: ataque,
                                        mensagem: ataque,
                                        criado_em: '2026-10-27',
                                        link,
                                        lida: false
                                    }
                                ]
                    }
                }
            })

            eventos.DOMContentLoaded()

            await nodes.get('btn-notificacoes').listeners.click({
                preventDefault() {},
                stopPropagation() {}
            })

            const item = nodes.get('lista-notificacoes').children[0]

            assert(!item.innerHTML.includes(ataque))

            assert.equal(
                item.querySelector('.notificacao-titulo').textContent,
                ataque
            )

            assert.equal(
                item.querySelector('.notificacao-mensagem').textContent,
                ataque
            )

            await item.listeners.click()

            assert.equal(window.location.href, esperado)

            assert(
                pedidos.some(
                    ([url, opts]) =>
                        url === '/notificacoes-api/1/lida' &&
                        opts.method === 'PUT'
                )
            )
        }
    }
)