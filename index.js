const delay = (delayInms) => {
	return new Promise(resolve => setTimeout(resolve, delayInms));
}

const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType,
	jidDecode
} = require('@adiwajshing/baileys')
const moment = require('moment-timezone')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { state, saveState } = useSingleFileAuthState('./session.json')
const config = require('./config')
const prefix = ''
const owner = ['761327688']
const axios = require('axios')
const { setMaxIdleHTTPParsers } = require('http')
const connectToWA = () => {
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})

	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
				connectToWA()
			}
		} else if (connection === 'open') {
			console.log('Bot Connected')
		}
	})

	conn.ev.on('creds.update', saveState)

	conn.ev.on('messages.upsert', async (mek) => {
		try {
			mek = mek.messages[0]
			if (!mek.message) return

			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid

			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'listResponseMessage') && mek.message.listResponseMessage.singleSelectReply.selectedRowId ? mek.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId ? mek.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage") && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''


			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''

			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
			const senderNumber = sender.split('@')[0]
			const botNumber = conn.user.id.split(':')[0]
			const pushname = mek.pushName || 'Sin Nombre'

			const isMe = botNumber.includes(senderNumber)
			const isowner = owner.includes(senderNumber) || isMe

			const reply = (teks) => {
				conn.sendMessage(from, { text: teks }, { quoted: mek })
			}




			switch (command) {

				case 'logo': case 'logo1': try {
					if (!q) return reply(`Example : ${prefix + command} vihanga`)
					let it = '```'
					let sections = []
					let listmenu = [`candy ${q}`, `christmas ${q}`, `3dchristmas ${q}`, `sparklechristmas ${q}`, `deepsea ${q}`, `scifi ${q}`, `toorainbow2 ${q}`, `waterpipe ${q}`, `spooky ${q}`, `pencil ${q}`, `circuit ${q}`, `discovery ${q}`, `metalic ${q}`, `fiction ${q}`, `demon ${q}`, `transformer ${q}`, `berry ${q}`, `thunder ${q}`, `3dstone2 ${q}`, `neonlight ${q}`, `glitch ${q}`, `harrypotter ${q}`, `brokenglass ${q}`, `papercut ${q}`, `watercolor ${q}`, `multicolor ${q}`, `neondevil ${q}`, `underwater ${q}`, `graffitibike ${q}`, `snow ${q}`, `cloud ${q}`, `honey ${q}`, `ice ${q}`, `queen ${q}`, `fruitjuice ${q}`, `biscuit ${q}`, `wood ${q}`, `chocolate ${q}`, `strawberry ${q}`, `matrix ${q}`, `blood ${q}`, `dropwater ${q}`, `toxic ${q}`, `lava ${q}`]
					let listmenuu = [`candy Logo`, `christmas Logo`, `3dchristmas Logo`, `sparklechristmas Logo`, `deepsea Logo`, `scifi Logo`, `toorainbow2 Logo`, `waterpipe Logo`, `spooky Logo`, `pencil Logo`, `circuit Logo`, `discovery Logo`, `metalic Logo`, `fiction Logo`, `demon Logo`, `transformer Logo`, `berry Logo`, `thunder Logo`, `3dstone2 Logo`, `neonlight Logo`, `glitch Logo`, `harrypotter Logo`, `brokenglass Logo`, `papercut Logo`, `watercolor Logo`, `multicolor Logo`, `neondevil Logo`, `underwater Logo`, `graffitibike Logo`, `snow Logo`, `cloud Logo`, `honey Logo`, `ice Logo`, `queen Logo`, `fruitjuice Logo`, `biscuit Logo`, `wood Logo`, `chocolate Logo`, `strawberry Logo`, `matrix Logo`, `blood Logo`, `dropwater Logo`, `toxic Logo`, `lava Logo`]

					let nombor = 1
					let startnum = 0

					for (let x of listmenu) {
						const list = {
							title: 'Logo Number ' + nombor++,
							rows: [
								{
									title: `${listmenuu[startnum++]}`,

									rowId: `${prefix}${x}`
								},
							]
						}
						sections.push(list)
					}
					const sendm = conn.sendMessage(
						from,
						{
							text: `┌───[🐉ASTRO-MD🐉]\n\n  *LOGO MAKER*\n\n${it}│🧚 Name:${it} ${q}\n\n└───────────◉`,
							footer: `${config.FOOTER}`,
							title: ``,
							buttonText: "SELECT LOGO",
							sections
						}, { quoted: mek })
				} catch (e) {
					await conn.sendMessage(from, { text: '*Error Try Again Later ⛔*' }, { quoted: mek })
				}
					break

				//......................................................Commands..............................................................\\

				case 'start':
				case 'sir':
				case 'Start': {
					let nombor = 401875331
					let sections = []

					for (let i = 401875331; i < 401875332; i++) {

						const filo = 'https://cloud.nadith.pro/pornozone/' + [nombor++]
						const file = filo + '.mp4'

						console.log(file)

						sections.push(file)

					}

					conn.sendMessage(config.GROUPJID, { text: sections })
					let delayres = await delay(60000);

				}
					break

				case 'Alive': {

					await conn.sendMessage(from, {
						document: { url: 'https://cloud.nadith.pro/pornozone/401875331.mp4' },
						mimetype: 'video/mp4',
						fileName: '@pornozone'
					})

				}
					break


				default:

					if (isowner && body.startsWith('>')) {
						try {
							await reply(util.format(await eval(`(async () => {${body.slice(1)}})()`)))
						} catch (e) {
							await reply(util.format(e))
						}
					}

			}

		} catch (e) {
			const isError = String(e)

			console.log(isError)
		}
	})
}

connectToWA()
