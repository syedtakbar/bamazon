SELECT 
		A.department_id, 
        A.department_name, 
        A.over_head_costs, 
        SUM(COALESCE(B.product_sales,0 )) AS product_sales,
		SUM(COALESCE(B.product_sales,0 )) - A.over_head_costs  AS total_profit
	FROM bamazon.departments A 
    
    LEFT OUTER JOIN bamazon.products B ON 
    A.department_name = B.department_name
    
    GROUP BY 
		A.department_id, 
        A.department_name, 
        A.over_head_costs
	
    ORDER BY A.department_id;