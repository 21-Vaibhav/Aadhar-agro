// src/services/blogService.js
import { 
    collection, 
    doc, 
    addDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    limit, 
    serverTimestamp,
    where
  } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
  import { db, storage } from "../firebase";
  
  // Collection reference
  const articlesRef = collection(db, "articles");
  
  export const getArticles = async () => {
    try {
      const articlesQuery = query(articlesRef, orderBy("date", "desc"));
      const snapshot = await getDocs(articlesQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate().toLocaleDateString("en-US") // Convert Firestore Timestamp to string
        };
      });
    } catch (error) {
      console.error("Error getting articles:", error);
      throw error;
    }
  };
  
  export const getArticleById = async (id) => {
    try {
      const docRef = doc(db, "articles", id);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) return null;
      
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        date: data.date?.toDate().toLocaleDateString("en-US") // Convert timestamp to string
      };
    } catch (error) {
      console.error("Error getting article:", error);
      throw error;
    }
  };
  // Upload an image to storage
  export const uploadArticleImage = async (file) => {
    try {
      const filename = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `blog-images/${filename}`);
      
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      return {
        url: downloadUrl,
        path: `blog-images/${filename}`
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  
  // Delete an image from storage
  export const deleteArticleImage = async (imagePath) => {
    if (!imagePath) return;
    
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  
  // Add a new article
  export const addArticle = async (articleData, imageFile = null) => {
    try {
      let imageData = null;
      
      if (imageFile) {
        imageData = await uploadArticleImage(imageFile);
      }
      
      const newArticle = {
        ...articleData,
        date: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(imageData && { imageUrl: imageData.url, imagePath: imageData.path })
      };
      
      const docRef = await addDoc(articlesRef, newArticle);
      return docRef.id;
    } catch (error) {
      console.error("Error adding article:", error);
      throw error;
    }
  };
  
  // Update an existing article
  export const updateArticle = async (id, articleData, imageFile = null) => {
    try {
      const articleRef = doc(db, "articles", id);
      const articleSnapshot = await getDoc(articleRef);
      
      if (!articleSnapshot.exists()) {
        throw new Error("Article not found");
      }
      
      const currentData = articleSnapshot.data();
      let updateData = {
        ...articleData,
        updatedAt: serverTimestamp()
      };
      
      // Handle image update
      if (imageFile) {
        // Delete old image if exists
        if (currentData.imagePath) {
          await deleteArticleImage(currentData.imagePath);
        }
        
        // Upload new image
        const imageData = await uploadArticleImage(imageFile);
        updateData.imageUrl = imageData.url;
        updateData.imagePath = imageData.path;
      }
      
      await updateDoc(articleRef, updateData);
      return id;
    } catch (error) {
      console.error("Error updating article:", error);
      throw error;
    }
  };
  
  // Delete an article
  export const deleteArticle = async (id) => {
    try {
      const articleRef = doc(db, "articles", id);
      const articleSnapshot = await getDoc(articleRef);
      
      if (!articleSnapshot.exists()) {
        throw new Error("Article not found");
      }
      
      // Delete associated image if exists
      const articleData = articleSnapshot.data();
      if (articleData.imagePath) {
        await deleteArticleImage(articleData.imagePath);
      }
      
      await deleteDoc(articleRef);
      return true;
    } catch (error) {
      console.error("Error deleting article:", error);
      throw error;
    }
  };
  
  // Get unique tags from all articles
  export const getAllTags = async () => {
    try {
      const articles = await getArticles({ limitTo: 100 });
      const tagsSet = new Set();
      
      articles.forEach(article => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      
      return Array.from(tagsSet);
    } catch (error) {
      console.error("Error getting tags:", error);
      throw error;
    }
  };