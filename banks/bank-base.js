// banks/bank-base.js
class BankBase {
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.hostPatterns = [];
      this.logoUrl = '';
    }
  
    detect(hostname) {
      return this.hostPatterns.some(pattern => hostname.includes(pattern));
    }
  }