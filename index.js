//Powered By @nadithpro

let numstart = 402147484144
let numend = 402147485719
let delays = 900000

const delay = (delayInms) => {
	return new Promise(resolve => setTimeout(resolve, delayInms));
}

const moment = require('moment-timezone')
const date1 = moment.tz('Asia/Colombo').format('HH:mm:ss')

var ffmpeg = require('fluent-ffmpeg');

const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType,
	jidDecode
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { state, saveState } = useSingleFileAuthState('./session.json')
const config = require('./config')
const prefix = '/'
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

			const isSUB = from == config.SENDJID ? true : false


			switch (command) {

				case 'jid': try {
					if (!from) return
					reply(from)
				}
					catch (e) {
						await conn.sendMessage(from, { text: '*Error ???*' }, { quoted: mek })
					}

					break

				//......................................................Commands..............................................................\\

				case 'start':
				case 'alive': {

					if (!isSUB) return

					conn.sendMessage(from, { react: { text: config.RTYPE3, key: mek.key } })

					for (let i = numstart; i <= numend; i++) {

						const filenum = numstart++


						//console.log(colors.brightCyan(date1,) + " " + colors.black.bgYellow('@pornozone ' + filenum + ' .mp4') + " " + colors.green("-START-") + " " + colors.blue('PornoZone'));

						await conn.sendMessage(config.GROUPJID, {
							caption: filenum + "@pornozone | PremiumPorn | Automated System | PornoZone ",
							image: { url: 'https://cloud.nadith.pro/mr_ninja/img/' + filenum + '_@pornozone.jpg' }
						})

						conn.sendMessage(from, { react: { text: config.RTYPE1, key: mek.key } })

						console.log('@pornozone ' + filenum + ' .mp4')
						//console.log(colors.brightCyan(date1,) + " " + colors.black.bgYellow('@pornozone ' + filenum + ' .mp4') + " " + colors.green("-SEND-") + " " + colors.blue('PornoZone'));

						await conn.sendMessage(config.GROUPJID, {
							document: { url: 'https://cloud.nadith.pro/mr_ninja/' + filenum + '_@pornozone.mp4' },
							mimetype: config.MP4TYPE,
							fileName: '@pornozone ' + filenum + ' .mp4'
						})

						//console.log(colors.brightCyan(date1,) + " " + colors.black.bgYellow('@pornozone ' + filenum + ' .mp4') + " " + colors.green("-DONE-") + " " + colors.blue('PornoZone'));

						//let delayres = await delay(delays);
					}

					conn.sendMessage(from, { react: { text: config.RTYPE2, key: mek.key } })

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
