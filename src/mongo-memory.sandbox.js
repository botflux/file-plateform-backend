const MongoMemoryServer = require('mongodb-memory-server').default

// console.log(MongoMemoryServer)
const mongod = new MongoMemoryServer()

const f = async () => {
    const uri =     await mongod.getConnectionString()
    const port =    await mongod.getPort()
    const dbPath =  await mongod.getDbPath()
    const dbName =  await mongod.getDbName()

    console.log(JSON.stringify({
        uri,
        port,
        dbPath,
        dbName
    }, null, 4))
    // console.log(mongod.getInstanceInfo())
    await mongod.stop()
}

f()