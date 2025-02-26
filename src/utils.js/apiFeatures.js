class ApiFeatures{

    constructor(query,queryString)
    {
      this.query=query;
      this.queryString=queryString;
    }
    filter()
    {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'field'];
      excludedFields.forEach(el => delete queryObj[el]);
      // Advance filtering
      // console.log(req.query);
      let queryStr = JSON.stringify(queryObj)
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      console.log(JSON.parse(queryStr));
      this.query.find(JSON.parse(queryStr))
      return this;
    }
    sort()
    {
      if (this.queryString.sort) {
        const sortBy = this.query.sort.split(',').join(' ');
        // console.log(sortBy);
        this.query = this.query.sort(sortBy)
      }
      else  {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
    limitField()
    {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        console.log(fields)
        this.query = this.query.select(fields)
      }
      else{
        this.query=this.query.select('-__v');
      }
      return this;
  
    }
    paginate()
    {
      const page =this.queryString.page*1||1;
      const limit= this.queryString.limit*1||2;
      const skip =(page-1)*limit;
      this.query=this.query.skip(skip).limit(limit);
      return this;
  
    }
  
   }
  export default ApiFeatures