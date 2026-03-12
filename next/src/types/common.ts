export interface productsType {
      data:{
            id: number
            title: string;
            poster: {
                  url: string
            }
            price: number;
            rating: number;
            slug: string;
      }[]
}

export interface product{
      id: number
      title: string;
      poster: {
            url: string
      }
      price: number;
      rating: number;
      slug: string;
}

export interface categoriesType {
      data:  {
            id: number;
            title: string;
            descr: string;
            slug: string;
            icon: {url:string};
      }[],
}

export interface user {
      id: number
      username: string
      email: string
      createdAt: string
}