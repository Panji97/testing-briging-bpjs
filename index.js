/**
 * 
 * Link: https://dvlp.bpjs-kesehatan.go.id:8888/trust-mark/login.html
Pilih Akun: Mitra BPJS Kesehatan
Username: ciciliachenny
Password: @CiciliaChenny123
*/

import crypto from 'crypto'
import LZString from 'lz-string'

const consumerID = '6224'
const consumerSecret = '9wG4753DB4'
const timestamp = Math.floor(Date.now() / 1000).toString()
const userKey = 'c13c4c69d6650de32502418a28d6c382'
const username = 'dvlp-cicilia'
const password = 'Cicilia2024@'
const kdAplikasi = '095'
const key = `${consumerID}${consumerSecret}${timestamp}`

const generateSignature = (value, key) => {
  return crypto.createHmac('sha256', key).update(value).digest('base64')
}

const headers = {
  'X-cons-id': consumerID,
  'X-timestamp': timestamp,
  'X-signature': generateSignature(`${consumerID}&${timestamp}`, consumerSecret),
  'X-authorization': `Basic ${Buffer.from(`${username}:${password}:${kdAplikasi}`).toString('base64')}`,
  user_key: userKey,
}

function decrypt(key, txt_enc) {
  // Buat hash SHA-256 dari kunci
  const keyHash = crypto.createHash('sha256').update(key, 'utf-8').digest()

  // Konfigurasi mode AES dengan CBC dan IV dari key hash
  const iv = keyHash.slice(0, 16)
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyHash.slice(0, 32), iv)

  // Dekripsi teks terenkripsi dan ubah ke string
  let decrypted = decipher.update(txt_enc, 'base64', 'utf-8')
  decrypted += decipher.final('utf-8')

  // Dekompresi teks yang telah didekripsi
  const decompressed = LZString.decompressFromEncodedURIComponent(decrypted)

  return decompressed
}

const params1 = '0000201419177'
const params2 = '2'
const params3 = '1'

const fetchDataJKN = async () => {
  const response = await fetch(`https://apijkn-dev.bpjs-kesehatan.go.id/pcare-rest-dev/peserta/${params1}`, {
    method: 'GET',
    headers: headers,
  })

  const repsonseJson = await response.json()

  const dataResponse = decrypt(key, repsonseJson.response)
  repsonseJson['response'] = JSON.parse(dataResponse)

  console.log(repsonseJson)
}

fetchDataJKN()
