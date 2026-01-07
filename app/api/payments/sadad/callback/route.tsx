
// // app/api/sadad/callback/route.ts
// import { NextResponse } from 'next/server';
// // lib/sadad-utils.ts
// import crypto from 'crypto';

// const IV = '@@@@&&&&####$$$$'; // The specific IV used in your PHP code

// /**
//  * Decrypts the data using AES-128-CBC to match PHP's openssl_decrypt
//  */
// function decrypt_e(crypt: string, key: string): string {
//   try {
//     // 1. Validate Key Length (AES-128 requires exactly 16 bytes)
//     // If the key is longer, PHP implicitly uses the first 16 bytes.
//     const validKey = key.length > 16 ? key.substring(0, 16) : key.padEnd(16, '\0');

//     // 2. Detect Encoding (Hex vs Base64)
//     // The log shows 'ecea63d0...', which is Hex. We must read it as Hex.
//     const isHex = /^[0-9a-fA-F]+$/.test(crypt);
//     const inputEncoding = isHex ? 'hex' : 'base64';

//     const decipher = crypto.createDecipheriv('aes-128-cbc', validKey, IV);
    
//     // 3. Decrypt
//     // If input is Hex, we tell update to read it as 'hex'
//     let decrypted = decipher.update(crypt, inputEncoding, 'utf8');
//     decrypted += decipher.final('utf8');
    
//     return decrypted;
//   } catch (error) {
//     console.error("Decryption failed:", error); 
//     // Return null or empty string to indicate failure
//     return "";
//   }
// }
// // 
// //  * Verifies the Checksum
// //  */
// export function verifyChecksum(
//   dataStr: string, // The JSON string of the response data
//   secretKey: string,
//   merchantId: string,
//   checksumResponse: string
// ): boolean {
//   // Construct the key exactly as the PHP script does: urlencode(secret) . merchantId
//   // Note: encodeURIComponent is the closest JS equivalent to PHP's urlencode, 
//   // but PHP encodes spaces as '+' whereas JS uses '%20'. 
//   // If your secret key has no special chars, this won't matter.
//   const sadad_secrete_key = encodeURIComponent(secretKey)
//       .replace(/%20/g, '+') // Align with PHP urlencode behavior
//       .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()); // RFC 3986 compliance to match PHP

//   const key = sadad_secrete_key + merchantId;

//   // 1. Decrypt the checksum provided by Sadad
//   const sadad_hash = decrypt_e(checksumResponse, key);

//   if (!sadad_hash) return false;

//   // 2. Extract Salt (Last 4 chars)
//   const salt = sadad_hash.slice(-4);

//   // 3. Recreate the hash string: JSON Data + | + Salt
//   const finalString = dataStr + "|" + salt;

//   // 4. Hash it using SHA256
//   const website_hash_gen = crypto.createHash('sha256').update(finalString).digest('hex');

//   // 5. Append salt to the generated hash (to match how it was packed)
//   const website_hash = website_hash_gen + salt;

//   // 6. Compare
//   return website_hash === sadad_hash;
// }

// export async function POST(request: Request) {
//   try {
//     // 1. Parse the incoming Form Data (Standard for Payment Gateways)
//     const formData = await request.formData();
//     const data: Record<string, any> = {};
    
//     // Convert FormData to a standard object
//     formData.forEach((value, key) => {
//       data[key] = value;
//     });

//     console.log('Received Sadad Callback Data:', data);

//     // 2. Extract checksum and Remove it from the data object
//     const checksumHash = data['checksumhash'];
//     delete data['checksumhash'];

//     if (!checksumHash) {
//       return NextResponse.json({ error: 'No checksum provided' }, { status: 400 });
//     }

//     // 3. Configuration (Store these in .env)
//     const MERCHANT_ID = process.env.SADAD_MERCHANT_ID || '6205111';
//     const SECRET_KEY = process.env.NEXT_PUBLIC_SADAD_SECRET_KEY || 'SjOwrbhyAI7i9ht1';

//     // 4. Reconstruct the structure used in PHP for the hash
//     // PHP: $data_repsonse['postData'] = $_POST;
//     // PHP: $data_repsonse['secretKey'] = urlencode($secretKey);
//     const sadad_secrete_key = encodeURIComponent(SECRET_KEY)
//       .replace(/%20/g, '+')
//       .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());

//     const dataResponse = {
//       postData: data,
//       secretKey: sadad_secrete_key
//     };

//     // 5. Serialize to JSON
//     // CRITICAL NOTE: PHP's json_encode and JS's JSON.stringify must produce 
//     // the EXACT same string (same order of keys, same spacing) for the hash to match.
//     // If verification fails, it is usually because the key order in 'data' 
//     // differs from what Sadad sent.
//     const jsonString = JSON.stringify(dataResponse);

//     // 6. Verify
//     const isValid = verifyChecksum(jsonString, SECRET_KEY, MERCHANT_ID, checksumHash);

//     if (isValid) {
//       console.log('✅ Sadad Transaction Verified Successfully');
      
//       // Perform your database updates here (mark order as paid)
      
//       return NextResponse.json({ status: 'success', message: 'Transaction verified' });
//     } else {
//       console.error('❌ Sadad Checksum Verification Failed');
//       return NextResponse.json({ status: 'failed', message: 'Invalid Checksum' }, { status: 400 });
//     }

//   } catch (error) {
//     console.error('API Error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming Form Data from Sadad
    const formData = await request.formData();
    const data: Record<string, any> = {};
    
    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    console.log("Received Callback Data:", data);

    // 2. Prepare the validation request
    // According to your image, we need to send the data as JSON
    // to https://sadadqa.com/userbusinesses/validateChecksum
    // (Note: Verify if the domain is sadadqa.com or sadad.qa based on your specific environment)
    
    const SADAD_API_URL = 'https://sadadqa.com/userbusinesses/validateChecksum'; 
    const SECRET_KEY = process.env.NEXT_PUBLIC_SADAD_SECRET_KEY || 'YOUR_SECRET_KEY';
    const REGISTERED_DOMAIN = 'stempark.logybyte.in'; // IMPORTANT: This must match the domain you registered with Sadad

    // 3. Call Sadad's Validation API
    const validationResponse = await fetch(SADAD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'secretkey': SECRET_KEY,
        'Origin': REGISTERED_DOMAIN // The documentation specifically asks for this header
      },
      body: JSON.stringify(data)
    });

    const validationResult = await validationResponse.json();

    console.log("Sadad Validation Result:", validationResult);

    // 4. Check the result
    if (validationResult.result === true) {
      // ✅ SUCCESS! 
      // The transaction is valid and paid.
      // Update your database here (e.g., set Order Status to 'PAID')
      
      console.log("✅ Payment Verified Successfully");
      return NextResponse.json({ status: 'success', message: 'Transaction verified' });
    } else {
      // ❌ FAILED
      // This is a fake request or a failed transaction
      console.error("❌ Payment Verification Failed: Invalid Checksum");
      return NextResponse.json({ status: 'failed', message: 'Invalid Checksum' }, { status: 400 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}