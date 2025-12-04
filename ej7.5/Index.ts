const productos = [
 { nombre: 'Camiseta', precio: 20, cantidad: 10, categoria: 'Ropa', fechaDeIngreso: '2024-11-01' },
 { nombre: 'Pantalones', precio: 50, cantidad: 0, categoria: 'Ropa', fechaDeIngreso: '2024-10-15' },
 { nombre: 'Zapatos', precio: 30, cantidad: 5, categoria: 'Calzado', fechaDeIngreso: '2024-11-10' },
 { nombre: 'Sombrero', precio: 15, cantidad: 20, categoria: 'Accesorios', fechaDeIngreso: '2024-11-05'},
 { nombre: 'Chaqueta', precio: 80, cantidad: 7, categoria: 'Ropa', fechaDeIngreso: '2024-11-11' },
 { nombre: 'Guantes', precio: 25, cantidad: 15, categoria: 'Accesorios', fechaDeIngreso: '2024-10-20' },
 { nombre: 'Bufanda', precio: 18, cantidad: 12, categoria: 'Accesorios', fechaDeIngreso: '2024-11-09' },
 { nombre: 'Gafas de sol', precio: 45, cantidad: 9, categoria: 'Accesorios', fechaDeIngreso:'2024-10-31' },
 { nombre: 'Reloj', precio: 120, cantidad: 3, categoria: 'Accesorios', fechaDeIngreso: '2024-11-03' },
 { nombre: 'Bolso', precio: 60, cantidad: 6, categoria: 'Accesorios', fechaDeIngreso: '2024-10-25' },
 { nombre: 'Cinturón', precio: 22, cantidad: 13, categoria: 'Accesorios', fechaDeIngreso: '2024-11-08'},
 { nombre: 'Vestido', precio: 70, cantidad: 4, categoria: 'Ropa', fechaDeIngreso: '2024-11-12' },
 { nombre: 'Falda', precio: 35, cantidad: 11, categoria: 'Ropa', fechaDeIngreso: '2024-10-18' },
 { nombre: 'Calcetines', precio: 8, cantidad: 30, categoria: 'Ropa', fechaDeIngreso: '2024-11-02' },
 { nombre: 'Pañuelo', precio: 12, cantidad: 25, categoria: 'Accesorios', fechaDeIngreso: '2024-11-07' },
 { nombre: 'Camiseta sin mangas', precio: 15, cantidad: 14, categoria: 'Ropa', fechaDeIngreso:'2024-10-22' },
 { nombre: 'Pantalones cortos', precio: 40, cantidad: 8, categoria: 'Ropa', fechaDeIngreso: '2024-10-30'},
 { nombre: 'Botas', precio: 90, cantidad: 5, categoria: 'Calzado', fechaDeIngreso: '2024-11-06' },
 { nombre: 'Sandalias', precio: 28, cantidad: 18, categoria: 'Calzado', fechaDeIngreso: '2024-10-27' },
 { nombre: 'Zapatos deportivos', precio: 65, cantidad: 7, categoria: 'Calzado', fechaDeIngreso:'2024-11-13'}
];

//1.Ordenar un array de menor a mayor por precio.
console.log("1.Ordenar un array de menor a mayor por precio.");
const ordenarPorPrecio = [...productos].sort((a, b) => a.precio - b.precio);
console.log(ordenarPorPrecio);

//2.Ordena el array de menor a mayor por fechaIngreso
console.log("2.Ordena el array de menor a mayor por fechaIngreso")
const ordenarPorFecha = [...productos].sort((a, b) => a.fechaDeIngreso - b.fechaDeIngreso);
console.log(ordenarPorFecha);

//3.Selecciona los artículos que tiene un precio inferior a 25
console.log("3.Selecciona los artículos que tiene un precio inferior a 25");
const filtrarPrecioMenor25 = productos.filter(precio => precio.precio < 25);
console.log(filtrarPrecioMenor25);

//4.Si el stock máximo es de 30 y el mínimo de 5 indicar el porcentaje de Stock de cada producto.
console.log("4.Si el stock máximo es de 30 y el mínimo de 5 indicar el porcentaje de Stock de cada producto");
const min = 5;
const max = 30;
productos.forEach(p => 
  console.log(`${p.nombre}: ${((p.cantidad - 5) / 25 * 100).toFixed(2)}%`)
);

//5.Agrupa los artículos por categoría
console.log("5.Agrupa los artículos por categoría");
const porCategoria: any = {};
productos.forEach(p => {
  if (!porCategoria[p.categoria]) porCategoria[p.categoria] = [];
  porCategoria[p.categoria].push(p);
});

console.log(porCategoria)

//6. Muestra los 3 productos más caros
console.log("6. Muestra los 3 productos más caros")
const productoscaros = [...productos].sort((a, b) => b.precio - a.precio).slice(0, 3);
console.log(productoscaros);

//7. Calcula cuánto ganaremos si vendemos todos los accesorios. Hay que tener en cuenta, el precio y cantidad
console.log("7. Calcula cuánto ganaremos si vendemos todos los accesorios. Hay que tener en cuenta, el precio y cantidad");
const ganancia = productos.filter(productos => productos.categoria === "Accesorios").reduce((acc, p) => acc + p.precio * p.cantidad, 0);
console.log(ganancia);

//8. Muestra los productos que han ingresado en los últimos 15 días
console.log("8. Muestra los productos que han ingresado en los últimos 15 días")
const ultimos15Dias = productos.filter(p => {
  const fecha = new Date(p.fechaDeIngreso);
  return fecha >= new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
});
console.log(ultimos15Dias);

// 9. Muestra el calzado con precio entre 20 y 30
console.log("9. Muestra el calzado con precio entre 20 y 30")
const zapatos2030 = productos.filter(p => p.categoria === "Calzado" && p.precio >= 20 && p.precio <= 30);
console.log(zapatos2030);

// 10. Agrega un nuevo producto
console.log("10. Agrega un nuevo producto")
const nuevoProducto: Producto = {nombre: 'Nosealgo',precio: 12,cantidad: 12,categoria: 'Calzado',fechaDeIngreso: '2025-12-04'};
productos.push(nuevoProducto);
console.log(nuevoProducto);

//11. Realiza un descuento del 5% a los 5 productos con mayor stock (suponiendo stock máximo es de 30 y el mínimo de 5)
console.log("11. Realiza un descuento del 5% a los 5 productos con mayor stock (suponiendo stock máximo es de 30 y el mínimo de 5")
const mayorStock = [...productos].sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);
mayorStock.forEach(p => p.precio *= 0.95);
console.log(mayorStock);

// 12. Borra los productos del mes de octubre
console.log("12. Borra los productos del mes de octubre");
const productosSinOctubre = productos.filter(p => new Date(p.fechaDeIngreso).getMonth() !== 9);
console.log(productosSinOctubre);