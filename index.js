import crypto from 'crypto'
import LZString from 'lz-string'

const consumerID = '6224'
const consumerSecret = '9wG4753DB4'
const timestamp = Math.floor(Date.now() / 1000).toString()
const userKey = 'c13c4c69d6650de32502418a28d6c382'
const username = 'dvlp-cicilia'
const password = 'Cicilia2024@'
const kdAplikasi = '095'

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

const params1 = '0000039043765'
const params2 = '2'
const params3 = '1'

fetch(`https://apijkn-dev.bpjs-kesehatan.go.id/pcare-rest-dev/spesialis`, {
  method: 'GET',
  headers: headers,
})
  .then((response) => response.json())
  .then((data) => {
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

    const key = `${consumerID}${consumerSecret}${timestamp}`

    if (data.response) {
      const result = decrypt(key, data.response)
      console.log(result)
    } else {
      console.error('Data response is null')
    }
  })
  .catch((error) => console.error(error))
