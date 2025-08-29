

export interface ReviewDto {
  rating: number;   
  text: string;     
}

export interface BookDto {
  id: string;        
  title: string;
  author: string;
  published: string; 
  category: string;
  reviews: ReviewDto[]; 
}
