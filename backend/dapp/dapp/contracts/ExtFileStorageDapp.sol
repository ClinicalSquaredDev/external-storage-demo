
import "../../lib/auth/contracts/UserManager.sol";

/**
 * Single entry point to all the project's contract
 * Replace this with your own code
 * Deployed by the deploy script
 */
 contract ExtFileStorageDapp {
   
   // internal
   address owner; //  debug only
   UserManager userManager;

   constructor() {
     owner = msg.sender;  //  debug only
     userManager = new UserManager(msg.sender);  
   }
 }
