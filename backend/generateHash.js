import bcrypt from "bcrypt";

const password = "admin@123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
  console.log("Generated hash:", hash);
  process.exit();
});
