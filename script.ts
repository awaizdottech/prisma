import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({ log: ["query"] })
// this can hanlde all concurrent connections of the db, so theres onle one client needed

async function main() {
  // await prisma.user.deleteMany()

  // const user = await prisma.user.create({
  //   data: {
  //     name: "alpha",
  //     email: "awaiz29249@gmail.com",
  //     age: 22,
  //     userPreferences: {
  //       create: {
  //         emailUpdates: true,
  //       },
  //     },
  //   },
  //   // include: {
  //   //   userPreferences: true,
  //   // },
  //   select: {
  //     name: true,
  //     userPreferences: { select: { id: true } },
  //   },
  //   // we cant use select & include at the same time. cant use select with createMany either
  // })
  // console.log("user", user)

  const user = await prisma.user.findMany({
    where: {
      // email: "awaiz29249@gmail.com", // can also be written as {equal:"awaiz29249@gmail.com"}
      // email: {not:"awaiz29249@gmail.com"},
      // email: { contains: "@gmail.com" }, //endsWith, startsWith
      // email: {in:["awaiz29249@gmail.com"]}, // similarly notIn
      // age: { lt: 20 }, // gt. lte. gte
      // AND: [{ email: { contains: "@gmail.com" } }, { age: { lt: 20 } }], // OR, NOT
      // age_name: {
      //   age: 22,
      //   name: "alpha",
      // }, // works with findUnique
      userPreferences: {
        emailUpdates: true,
      },
      writtenPosts: {
        every: {
          title: "test",
        }, // none,some
      },
    }, // we can also use select & include here, but not with many option
    // distinct:['name','age'],
    // orderBy: {
    //   age: "asc",
    // },
    // take: 2,
    // skip: 1,
  })

  const post = await prisma.post.findMany({
    where: {
      author: {
        is: {
          age: 22,
        }, // isNot
      },
    },
  })

  const update = await prisma.user.update({
    data: {
      age: {
        increment: 1, // decrement, multiply, divide
      },
      userPreferences: {
        // create:{
        //   emailUpdates:true
        // }
        connect: { id: "123456" }, // this is userPr... id, connect can also be used in create & we also have disconnect that can be set to true as its a one-one relation but that can also be specified just like connect
      },
    },
    where: {
      email: "wth", // field needs to be unique
    }, // select & include but not with the many
  })

  const del = await prisma.user.delete({
    where: {
      email: "", // field needs to be unique
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error("error", e)
    await prisma.$disconnect()
    process.exit(1)
  })
