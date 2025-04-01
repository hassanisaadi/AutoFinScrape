class CIBCBank extends BankBase {
  constructor() {
    super('CIBC', 'Canadian Imperial Bank of Commerce');
    this.hostPatterns = ['cibc.com'];
    this.logoUrl = 'icons/cibc_logo.png';
  }
}

// Register the class globally
window.BankRegistry = window.BankRegistry || [];
window.BankRegistry.push(CIBCBank);

// Placeholder for CIBC account functions
// function cibcAccountFunction() {
//     // TODO: Implement CIBC account scraping logic here
// } 