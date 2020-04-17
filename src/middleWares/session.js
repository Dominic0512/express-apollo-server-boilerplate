import session from "express-session";

export default session({
  secret: "i-appter-local",
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
});
