export class BaseUrls {

  public static readonly BASE_HREF: string = "http://localhost:8080";

  public static readonly ADMIN_GROUPURL: string = "adminauth";
  public static readonly CARS_GROUPURL: string = "cars";
  public static readonly CART_GROUPURL: string = "cart";
  public static readonly CATEGORIES_GROUPURL: string = "categories";
  public static readonly INTEREST_GROUPURL: string = "interest";
  public static readonly USER_GROUPURL: string = "users";
  public static readonly WISHLIST_GROUPURL: string = "wishlist";


  public static readonly USER_ADDRESS_GROUPURL: string = "user-addresses";
  public static readonly RESTAURANT_GROUPURL: string = "user-addresses";
  public static readonly DISHES_GROUPURL: string = "dishes";
  public static readonly ORDER_GROUPURL: string = "orders";
  public static readonly ORDER_ITEMS_GROUPURL: string = "orderitems";

  public static getUrl(key: string): string { return `${this.BASE_HREF}/${key}/get`;}
  public static getAddUrl(key: string): string { return `${this.BASE_HREF}/${key}/add`;}
  public static getUpdateUrl(key: string): string { return `${this.BASE_HREF}/${key}/update`;}
  public static getDeleteUrl(key: string): string { return `${this.BASE_HREF}/${key}/delete`;}
  public static getLoginUrl(key: string): string { return `${this.BASE_HREF}/${key}/login`;}
  
}