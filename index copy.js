//Powered By @nadithpro

let numstart = 2
let numend = 1
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
						await conn.sendMessage(from, { text: '*Error ⛔*' }, { quoted: mek })
					}

					break

				//......................................................Commands..............................................................\\

				case 'start':
				case 'alive': {

					if (!isSUB) return

					for (let i = numstart; i > numend; i++) {

						const { esana_scrape, esana_latest_news_id, esana_scrape_from_id } = require("esana-node-api").esana_news;
						const latest_news = await esana_scrape({ fetch: 'latest', passcode: '74VihangaYt' }) // Enter Your Passcode or Contact Admin (+94766239744)   

						//----------------------------------------save news url evey 10 secs-------------------
						setInterval(myTimeer, 100000);
						function myTimeer() {
							const stringToWrite = latest_news.news.helakuru.url.replace('https://www.helakuru.lk/esana/news/', '')

							fs.writeFile("./auth_info_baileys/test.txt", `${stringToWrite}`, (err) => {
								if (err) {
									console.error(err);
									return;
								}
							});
						}

						//------------------------send news-----------------------------------------
						setInterval(myTimeer, 1000);
						function myTimeer() {
							fs.readFile("./auth_info_baileys/test.txt", (err, data) => {
								if (err) throw err;
								const stringTwoWrite = latest_news.news.helakuru.url.replace('https://www.helakuru.lk/esana/news/', '')
								if (!data.toString().includes(stringTwoWrite)) {
									let news = `*පුවත 📰:* ${latest_news.news.helakuru.title}
*වැඩි විස්තර 📃:* ${latest_news.news.helakuru.description}
*පුවත ලැබූ වෙලාව ⌚:* _${latest_news.news.helakuru.data}_
*භාෂාව 🔄:* ${latest_news.news.helakuru.lang}`
									let sendi = conn.sendMessage('120363026723741666@g.us', { image: { url: latest_news.news.helakuru.thumb }, caption: news })
									conn.sendMessage("120363026723741666@g.us", { react: { text: `📰`, key: sendi.key } })
									const stringToWrite = latest_news.news.helakuru.url.replace('https://www.helakuru.lk/esana/news/', '')

									fs.writeFile("./auth_info_baileys/test.txt", `${stringToWrite}`, (err) => {
										if (err) {
											console.error(err);
											return;
										}
									});
								}
							});
						}


					}

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
