export interface productsType {
      data:{
            title: string;
            poster: {
                  url: string
            }
            price: number;
            rating: number;
            slug: string;
      }[]
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