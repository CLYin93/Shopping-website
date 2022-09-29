import express from 'express'
import formidable from 'formidable'
export const AIroutes = express.Router()
import fs from 'fs'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const uploadDir = 'uploadImg'
fs.mkdirSync(uploadDir, { recursive: true })

const form = formidable({
	uploadDir,
	keepExtensions: true,
	maxFiles: 1,
	maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
	filter: (part) => part.mimetype?.startsWith('image/') || false
})

let filename: string = ''
AIroutes.post('/uploadimg', async (req, res) => {
	try {
		form.parse(req, async (err, fields, files: any) => {
			filename = files.upload.newFilename
			// console.log(filename)
			// console.log(`${process.env.PYTHON_DOMAIN}runAI`)
			//@ts-ignore

			const response = await fetch('https://aisearch.hnchan.me/runAI', {
				method: 'POST',
				body: filename
			})
			const data = await response.json()
			console.log(data, '= results by python ') // results by python
			let name = encodeURI(data)

			const productsSearch = await fetch(
				`https://hnchan.me/product/SearchProduct?keyWord=${name}`
			)
			const results = await productsSearch.json()

			// console.log(results)

			res.json(results)

			fs.unlinkSync('uploadImg/' + filename)
		})
	} catch (err) {
		res.json(false)
		console.log(err)
	}
})
