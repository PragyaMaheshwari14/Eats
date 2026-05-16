const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file, fileName) {

    try {

        console.log("Upload started");

        // Convert buffer to base64
        const base64File = file.toString("base64");

        const result = await imagekit.files.upload({
            file: base64File,
            fileName: fileName,
        });

        console.log("Upload completed");
        console.log(result);

        return result;

    } catch (error) {

        console.log("IMAGEKIT ERROR:");
        console.log(error);

        throw error;
    }
}

module.exports = {
    uploadFile
}