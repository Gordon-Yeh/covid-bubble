class Logger {
  name:string;

  constructor(name : string) {
    this.name = name;
  }
  
  print(...args) : void {
    if (process.env.NODE_ENV === 'development')
      console.log(`[${(new Date()).toISOString()}]`, this.name, ...args);
  }
}

export default function createLogger(name : string) {
  return new Logger(name);
}