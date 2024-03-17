const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();

async function generateKey(){
    await prisma.authKey.create({
        data: {
            key: "hostelAdminKey@1234",
            role: "hostel_admin"
        }
    });
}

generateKey();